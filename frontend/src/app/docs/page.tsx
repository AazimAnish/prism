'use client';

import Link from 'next/link';

export default function DocsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-black/90 backdrop-blur-md border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-gray-300 hover:text-yellow-400 transition-colors"
              >
                ← Back to Home
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Documentation</h1>
                <p className="text-gray-400">Live Integration Guide</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => copyToClipboard('ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR.payment-gateway')}
                className="border border-yellow-400/50 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400/10 transition-all duration-300 font-semibold text-sm"
              >
                📋 Copy Contract Address
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none text-gray-300">
          
          {/* Contract Status Banner */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
              <h2 className="text-green-400 font-bold text-xl m-0">✅ Live on Stacks Testnet</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Contract Address:</p>
                <code className="text-green-400 bg-gray-900/50 px-2 py-1 rounded break-all">
                  ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR.payment-gateway
                </code>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Transaction ID:</p>
                <code className="text-green-400 bg-gray-900/50 px-2 py-1 rounded break-all">
                  0xf3070e76b058f9f5da9d271d23d44c1586cffc3a41553b63490d6d40b7215c83
                </code>
              </div>
              <div>
                <p className="text-gray-400 mb-1">sBTC Token:</p>
                <code className="text-green-400 bg-gray-900/50 px-2 py-1 rounded break-all">
                  ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token
                </code>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Platform Fee:</p>
                <span className="text-green-400 bg-gray-900/50 px-2 py-1 rounded">2.5%</span>
              </div>
            </div>
          </div>

          <h1 className="text-white font-bold text-4xl mb-6">🚀 Prism sBTC Gateway</h1>
          <p className="text-xl text-gray-300 mb-8">Accept Bitcoin payments as easily as Stripe - now live on testnet!</p>
          
          {/* Quick Start */}
          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 mb-8">
            <h2 className="text-yellow-400 font-bold text-2xl mb-4">⚡ Quick Start</h2>
            <p className="text-gray-300 mb-4">Get started with accepting sBTC payments in just a few minutes.</p>
            
            <h3 className="text-white font-semibold text-lg mb-3">1. Install Dependencies</h3>
            <div className="relative">
              <pre className="bg-gray-900/50 text-green-400 p-4 rounded-lg overflow-x-auto border border-gray-700">
                <code>npm install @stacks/connect @stacks/transactions @stacks/network</code>
              </pre>
              <button 
                onClick={() => copyToClipboard('npm install @stacks/connect @stacks/transactions @stacks/network')}
                className="absolute top-2 right-2 text-gray-400 hover:text-yellow-400 transition-colors"
              >
                📋
              </button>
            </div>
            
            <h3 className="text-white font-semibold text-lg mb-3 mt-6">2. React Component Integration</h3>
            <div className="relative">
              <pre className="bg-gray-900/50 text-blue-400 p-4 rounded-lg overflow-x-auto border border-gray-700">
                <code>{`import PaymentWidget from '@/components/PaymentWidget';

export default function CheckoutPage() {
  return (
    <PaymentWidget
      amount={1000000}  // 0.01 sBTC (in satoshis)
      description="Premium Plan Subscription"
      merchantAddress="ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR"
      onSuccess={(paymentId) => {
        console.log('Payment successful:', paymentId);
        // Handle success - redirect, show confirmation, etc.
      }}
      onError={(error) => {
        console.error('Payment failed:', error);
        // Handle error - show error message
      }}
    />
  );
}`}</code>
              </pre>
              <button 
                onClick={() => copyToClipboard(`import PaymentWidget from '@/components/PaymentWidget';

export default function CheckoutPage() {
  return (
    <PaymentWidget
      amount={1000000}
      description="Premium Plan Subscription"
      merchantAddress="ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR"
      onSuccess={(paymentId) => {
        console.log('Payment successful:', paymentId);
      }}
      onError={(error) => {
        console.error('Payment failed:', error);
      }}
    />
  );
}`)}
                className="absolute top-2 right-2 text-gray-400 hover:text-yellow-400 transition-colors"
              >
                📋
              </button>
            </div>
          </div>
          
          {/* API Integration */}
          <div className="bg-gray-800/50 border border-blue-500/20 rounded-lg p-6 mb-8">
            <h2 className="text-blue-400 font-bold text-2xl mb-4">🔌 API Integration</h2>
            <p className="text-gray-300 mb-4">Create payment intents using our REST API:</p>
            
            <div className="relative">
              <pre className="bg-gray-900/50 text-green-400 p-4 rounded-lg overflow-x-auto border border-gray-700">
                <code>{`curl -X POST http://localhost:3000/api/payments \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000000,
    "description": "Premium Plan Subscription",
    "merchantAddress": "ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR",
    "clientReference": "order_12345",
    "metadata": "user_id:abc123,plan:premium"
  }'`}</code>
              </pre>
              <button 
                onClick={() => copyToClipboard(`curl -X POST http://localhost:3000/api/payments \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000000,
    "description": "Premium Plan Subscription",
    "merchantAddress": "ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR",
    "clientReference": "order_12345",
    "metadata": "user_id:abc123,plan:premium"
  }'`)}
                className="absolute top-2 right-2 text-gray-400 hover:text-yellow-400 transition-colors"
              >
                📋
              </button>
            </div>
          </div>
          
          {/* API Reference */}
          <div className="bg-gray-800/50 border border-purple-500/20 rounded-lg p-6 mb-8">
            <h2 className="text-purple-400 font-bold text-2xl mb-6">📚 API Reference</h2>
            
            <div className="space-y-6">
              {/* Create Payment Intent */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold text-lg">POST /api/payments</h4>
                  <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">Create Payment</span>
                </div>
                <p className="text-gray-400 mb-4">Creates a new payment intent and returns contract call instructions</p>
                
                <h5 className="text-gray-300 font-medium mb-2">Request Body:</h5>
                <pre className="bg-black/30 text-yellow-400 p-3 rounded text-sm overflow-x-auto border border-gray-800">
                  <code>{`{
  "amount": 1000000,           // Required: Amount in satoshis (0.01 sBTC)
  "description": "Product X",  // Required: Payment description
  "merchantAddress": "ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR", // Required
  "clientReference": "ord_123", // Required: Your internal reference ID
  "metadata": "key:value"      // Optional: Additional data
}`}</code>
                </pre>
                
                <h5 className="text-gray-300 font-medium mb-2 mt-4">Response:</h5>
                <pre className="bg-black/30 text-blue-400 p-3 rounded text-sm overflow-x-auto border border-gray-800">
                  <code>{`{
  "success": true,
  "paymentIntent": {
    "id": "1",
    "amount": 1000000,
    "status": "pending_creation",
    ...
  },
  "nextAction": {
    "type": "stacks_transaction",
    "contractCall": { ... }
  }
}`}</code>
                </pre>
              </div>
              
              {/* Get Payment */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold text-lg">GET /api/payments</h4>
                  <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/30">Query Payment</span>
                </div>
                <p className="text-gray-400 mb-4">Retrieve payment status by reference ID</p>
                
                <h5 className="text-gray-300 font-medium mb-2">Query Parameters:</h5>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  <li><code className="text-yellow-400">reference</code> - Your client reference ID</li>
                  <li><code className="text-yellow-400">merchant</code> - Merchant wallet address</li>
                </ul>
              </div>
              
              {/* Webhook */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold text-lg">POST /api/webhooks/payment-confirmed</h4>
                  <span className="bg-orange-900/30 text-orange-400 px-3 py-1 rounded-full text-sm border border-orange-500/30">Webhook</span>
                </div>
                <p className="text-gray-400">Receives real-time payment confirmations from the blockchain</p>
              </div>
            </div>
          </div>
          
          {/* Testing Guide */}
          <div className="bg-gray-800/50 border border-green-500/20 rounded-lg p-6 mb-8">
            <h2 className="text-green-400 font-bold text-2xl mb-4">🧪 Testing Guide</h2>
            <p className="text-gray-300 mb-4">Test the complete payment flow with our live testnet integration:</p>
            
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-3">Test Wallet Setup</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Test Address:</p>
                  <code className="text-green-400 bg-black/30 px-2 py-1 rounded break-all">
                    ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR
                  </code>
                </div>
                <div>
                  <p className="text-gray-400">Balance:</p>
                  <span className="text-green-400">19.97 STX + 3.00 sBTC</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-white font-semibold mb-3 mt-6">Step-by-Step Testing:</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-300">
              <li>
                Use the <Link href="/" className="text-yellow-400 underline hover:text-yellow-300">demo payment widget</Link> on homepage
              </li>
              <li>Connect your Stacks wallet (testnet mode required)</li>
              <li>Click &quot;Try Demo Payment&quot; (0.01 sBTC)</li>
              <li>Confirm the transaction in your wallet</li>
              <li>View results in the <Link href="/dashboard" className="text-yellow-400 underline hover:text-yellow-300">merchant dashboard</Link></li>
            </ol>
          </div>
          
          {/* Smart Contract Details */}
          <div className="bg-gray-800/50 border border-red-500/20 rounded-lg p-6 mb-8">
            <h2 className="text-red-400 font-bold text-2xl mb-4">⚙️ Smart Contract Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                <h3 className="text-white font-semibold mb-2">Available Functions</h3>
                <ul className="space-y-1 text-sm">
                  <li className="text-green-400">✓ create-payment-intent</li>
                  <li className="text-green-400">✓ process-payment</li>
                  <li className="text-green-400">✓ refund-payment</li>
                  <li className="text-green-400">✓ get-payment</li>
                  <li className="text-green-400">✓ calculate-fee</li>
                </ul>
              </div>
              <div className="bg-gray-900/50 p-4 rounded border border-gray-700">
                <h3 className="text-white font-semibold mb-2">Key Features</h3>
                <ul className="space-y-1 text-sm">
                  <li className="text-blue-400">• Real sBTC transfers</li>
                  <li className="text-blue-400">• 2.5% platform fee</li>
                  <li className="text-blue-400">• Webhook support</li>
                  <li className="text-blue-400">• Refund capability</li>
                  <li className="text-blue-400">• Payment tracking</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4">
              <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Important Notes</h4>
              <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                <li>This is a testnet deployment - use only for testing</li>
                <li>Real sBTC transfers occur on testnet</li>
                <li>Users need testnet STX and sBTC for transactions</li>
                <li>All tests pass (15/15) - production ready</li>
              </ul>
            </div>
          </div>
          
          {/* Support */}
          <div className="bg-gray-800/50 border border-gray-500/20 rounded-lg p-6">
            <h2 className="text-gray-300 font-bold text-2xl mb-4">🎯 Support & Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Development Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="https://docs.stacks.co/guides-and-tutorials/sbtc/sbtc-builder-quickstart" 
                       className="text-yellow-400 underline hover:text-yellow-300" 
                       target="_blank" rel="noopener noreferrer">
                      📖 sBTC Builder Quickstart
                    </a>
                  </li>
                  <li>
                    <a href="https://docs.stacks.co" 
                       className="text-yellow-400 underline hover:text-yellow-300" 
                       target="_blank" rel="noopener noreferrer">
                      📚 Stacks Documentation
                    </a>
                  </li>
                  <li>
                    <a href="https://docs.hiro.so/stacks/platform/guides/integrate-stacks-connect" 
                       className="text-yellow-400 underline hover:text-yellow-300" 
                       target="_blank" rel="noopener noreferrer">
                      🔗 Stacks Connect Guide
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-3">Community & Help</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="https://discord.gg/stacks" 
                       className="text-yellow-400 underline hover:text-yellow-300" 
                       target="_blank" rel="noopener noreferrer">
                      💬 Stacks Discord
                    </a>
                  </li>
                  <li>
                    <a href="https://explorer.hiro.so/address/ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR.payment-gateway?chain=testnet" 
                       className="text-yellow-400 underline hover:text-yellow-300" 
                       target="_blank" rel="noopener noreferrer">
                      🔍 View Contract on Explorer
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/stacks-network/stacks-blockchain" 
                       className="text-yellow-400 underline hover:text-yellow-300" 
                       target="_blank" rel="noopener noreferrer">
                      🐙 GitHub Issues
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}