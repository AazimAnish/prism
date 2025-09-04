import { NextRequest, NextResponse } from 'next/server';
import { 
  AnchorMode,
  PostConditionMode,
  principalCV, 
  uintCV,
  fetchCallReadOnlyFunction,
  cvToValue 
} from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

const network = STACKS_TESTNET;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR';
const CONTRACT_NAME = 'payment-gateway';

// POST /api/payments/process - Process an sBTC payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, customerAddress, privateKey } = body;

    if (!paymentId || !customerAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: paymentId, customerAddress' },
        { status: 400 }
      );
    }

    // Create the contract call transaction
    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'process-payment',
      functionArgs: [
        uintCV(parseInt(paymentId)),
        principalCV(customerAddress)
      ],
      senderKey: privateKey, // In production, this should be handled securely
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    // Validate the payment intent exists and is valid
    try {
      const paymentResult = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-payment',
        functionArgs: [uintCV(parseInt(paymentId))],
        network,
        senderAddress: CONTRACT_ADDRESS
      });

      const paymentData = cvToValue(paymentResult);
      
      if (paymentData.type === 'none') {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }

      const payment = paymentData.value;
      
      // Check if payment is in the correct status
      if (payment.status.data !== 'created') {
        return NextResponse.json(
          { error: 'Payment cannot be processed in current status: ' + payment.status.data },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Payment ready for processing',
        transactionDetails: {
          paymentId: parseInt(paymentId),
          customer: customerAddress,
          amount: payment.amount.value,
          merchant: payment.merchant.value,
          contractCall: {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'process-payment'
          }
        },
        // Instructions for frontend to complete the transaction
        nextAction: {
          type: 'sign_transaction',
          transaction: txOptions
        }
      });

    } catch (contractError) {
      console.error('Error validating payment:', contractError);
      return NextResponse.json(
        { error: 'Unable to validate payment' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}