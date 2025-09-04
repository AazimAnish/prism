'use client';

import { useState, useEffect } from 'react';

// Stacks Connect will be loaded dynamically to avoid SSR issues

interface PaymentWidgetProps {
  amount: number;
  description: string;
  merchantAddress: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export default function PaymentWidget({
  amount,
  description,
  merchantAddress,
  onSuccess,
  onError
}: PaymentWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'creating' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const connectWallet = async () => {
    try {
      // Dynamically import Stacks Connect to avoid SSR issues
      const { showConnect } = await import('@stacks/connect');
      
      showConnect({
        appDetails: {
          name: 'Prism sBTC Gateway',
          icon: window.location.origin + '/favicon.ico',
        },
        onFinish: (authData: { userSession: { loadUserData: () => { profile: { stxAddress: { testnet: string } } } } }) => {
          setIsConnected(true);
          setUserAddress(authData.userSession.loadUserData().profile.stxAddress.testnet);
          setPaymentStatus('idle');
        },
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setErrorMessage('Failed to connect wallet. Please try again.');
    }
  };

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      setPaymentStatus('creating');

      // Step 1: Create payment intent
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description,
          merchantAddress,
          clientReference: `payment_${Date.now()}`,
          metadata: JSON.stringify({ widget: true })
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setPaymentStatus('processing');

      // Step 2: Process the payment directly (this requires wallet approval for sBTC transfer)
      const { openContractCall } = await import('@stacks/connect');
      const { STACKS_TESTNET } = await import('@stacks/network');
      const { uintCV, principalCV } = await import('@stacks/transactions');
      
      if (!userAddress) {
        throw new Error('User wallet not connected');
      }
      
      const processOptions = {
        contractAddress: data.nextAction.contractCall.contractAddress,
        contractName: data.nextAction.contractCall.contractName,
        functionName: 'process-payment',
        functionArgs: [
          uintCV(parseInt(data.paymentIntent.id)),
          principalCV(userAddress)
        ],
        network: STACKS_TESTNET,
        appDetails: {
          name: 'Prism sBTC Gateway',
          icon: window.location.origin + '/favicon.ico',
        },
        onFinish: ({ txId }: { txId: string }) => {
          console.log('sBTC payment processed successfully! Transaction:', txId);
          setPaymentStatus('success');
          onSuccess?.(data.paymentIntent.id);
        },
        onCancel: () => {
          setPaymentStatus('idle');
          setLoading(false);
          setErrorMessage('Payment was cancelled by user');
        }
      };

      // This will prompt the user's wallet for approval to transfer sBTC
      await openContractCall(processOptions);

    } catch (error) {
      setPaymentStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Payment failed';
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return (amount / 100000000).toFixed(8); // Convert from satoshis to sBTC
  };

  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  
  // Check wallet connection status on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Dynamically import to avoid SSR issues
        const { AppConfig, UserSession } = await import('@stacks/connect');
        
        const appConfig = new AppConfig(['store_write', 'publish_data']);
        const userSession = new UserSession({ appConfig });
        
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          setIsConnected(true);
          setUserAddress(userData.profile.stxAddress.testnet);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };
    
    checkWalletConnection();
  }, []);

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600">Your payment has been processed successfully.</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h3>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <button
            onClick={() => {
              setPaymentStatus('idle');
              setErrorMessage('');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Pay with sBTC</h3>
        <div className="text-3xl font-bold text-blue-600 mb-1">
          {formatAmount(amount)} sBTC
        </div>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">{formatAmount(amount)} sBTC</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Network Fee:</span>
          <span className="font-medium">~0.0001 sBTC</span>
        </div>
        <div className="flex justify-between items-center border-t pt-2">
          <span className="text-gray-900 font-medium">Total:</span>
          <span className="font-bold text-lg">{formatAmount(amount + 10000)} sBTC</span>
        </div>
      </div>

      {/* Connection & Payment */}
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium"
        >
          Connect Stacks Wallet
        </button>
      ) : (
        <div>
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="flex flex-col">
                <span className="text-green-800 text-sm font-medium">Wallet Connected</span>
                <span className="text-green-600 text-xs truncate max-w-xs">
                  {userAddress}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={createPaymentIntent}
            disabled={loading || paymentStatus === 'processing'}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentStatus === 'creating' && 'Creating Payment Intent...'}
            {paymentStatus === 'processing' && 'Check Your Wallet - Approve Transaction'}
            {paymentStatus === 'idle' && 'Pay with sBTC'}
          </button>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Secured by Stacks blockchain • Powered by Prism Gateway
        </p>
      </div>
    </div>
  );
}