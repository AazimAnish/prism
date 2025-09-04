import { NextRequest, NextResponse } from 'next/server';
import { stringAsciiCV, principalCV, fetchCallReadOnlyFunction, cvToValue, cvToString } from '@stacks/transactions';
import { STACKS_TESTNET } from '@stacks/network';

// Contract configuration - should be moved to environment variables in production
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR';
const CONTRACT_NAME = 'payment-gateway';
const network = STACKS_TESTNET;

// sBTC Token contract - for reference
// const SBTC_TOKEN_ADDRESS = 'ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token';

// POST /api/payments - Create a payment intent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'SBTC', description, metadata, clientReference, merchantAddress } = body;

    if (!amount || !description || !clientReference || !merchantAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, description, clientReference, merchantAddress' },
        { status: 400 }
      );
    }

    // Generate payment intent that will be created on-chain
    // The payment ID will be determined by the smart contract
    try {
      // Get the next payment ID from the contract
      const nextIdResult = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-next-payment-id',
        functionArgs: [],
        network,
        senderAddress: CONTRACT_ADDRESS
      });

      const nextPaymentId = cvToValue(nextIdResult);
      
      const paymentIntent = {
        id: nextPaymentId.toString(),
        amount: parseInt(amount),
        currency,
        description,
        metadata: metadata || '',
        clientReference,
        merchantAddress,
        status: 'pending_creation',
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        paymentIntent,
        // Include instructions for frontend integration
        nextAction: {
          type: 'stacks_transaction',
          contractCall: {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'create-payment-intent',
            functionArgs: {
              amount: paymentIntent.amount,
              currency: currency,
              description: description,
              metadata: metadata || '',
              clientReference: clientReference
            }
          }
        }
      });

    } catch (contractError) {
      console.error('Error reading from contract:', contractError);
      // Fallback to local ID generation if contract is not available
      const paymentIntent = {
        id: Date.now().toString(),
        amount: parseInt(amount),
        currency,
        description,
        metadata: metadata || '',
        clientReference,
        merchantAddress,
        status: 'pending_creation',
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        paymentIntent,
        nextAction: {
          type: 'stacks_transaction',
          contractCall: {
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'create-payment-intent',
            functionArgs: {
              amount: paymentIntent.amount,
              currency: currency,
              description: description,
              metadata: metadata || '',
              clientReference: clientReference
            }
          }
        }
      });
    }

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/payments?reference=xxx&merchant=xxx - Get payment by reference
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');
    const merchant = searchParams.get('merchant');
    const paymentId = searchParams.get('id');

    if (!reference || !merchant) {
      return NextResponse.json(
        { error: 'Missing required parameters: reference, merchant' },
        { status: 400 }
      );
    }

    // Query the contract for payment details by reference
    try {
      const paymentResult = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-payment-by-reference',
        functionArgs: [
          principalCV(merchant),
          stringAsciiCV(reference)
        ],
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
      
      return NextResponse.json({
        success: true,
        payment: {
          id: paymentId,
          reference,
          merchant: cvToString(payment.merchant),
          customer: cvToString(payment.customer),
          amount: payment.amount.value,
          currency: cvToString(payment.currency),
          status: cvToString(payment.status),
          description: cvToString(payment.description),
          metadata: cvToString(payment.metadata),
          createdAt: payment['created-at'].value,
          processedAt: payment['processed-at'].type === 'some' ? payment['processed-at'].value.value : null
        }
      });
      
    } catch (contractError) {
      console.error('Error querying contract:', contractError);
      return NextResponse.json(
        { error: 'Unable to query payment status' },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}