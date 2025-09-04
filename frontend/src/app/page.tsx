'use client';

import { useState } from 'react';
import PaymentWidget from './components/PaymentWidget';
import PrismBackground from './components/PrismBackground';
import SpotlightCard from './components/SpotlightCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <PrismBackground />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-yellow-300/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 bg-black/90 backdrop-blur-md border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">P</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Prism</h1>
                  <span className="text-xs text-gray-400 -mt-1 block">sBTC Gateway</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/dashboard"
                className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400/10"
              >
                Dashboard
              </Link>
              <Link 
                href="/docs"
                className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-yellow-400/10"
              >
                Docs
              </Link>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-yellow-400/25 transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-7xl font-black text-white mb-6 leading-tight">
            Accept <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">sBTC Payments</span><br />
            <span className="text-5xl">Like Stripe</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            The easiest way for businesses to accept Bitcoin payments via sBTC on Stacks. 
            Simple integration, powerful features, and seamless user experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <button 
              onClick={() => setShowDemo(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-10 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 text-lg font-semibold shadow-2xl hover:shadow-yellow-400/25 transform hover:scale-105 border border-yellow-300"
            >
              🚀 Try Demo Payment
            </button>
            <Link 
              href="/dashboard"
              className="border-2 border-yellow-400/50 text-yellow-400 px-10 py-4 rounded-xl hover:bg-yellow-400/10 hover:border-yellow-400 transition-all duration-300 text-lg font-semibold backdrop-blur-sm"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SpotlightCard
            title="Lightning Fast Setup"
            description="Integrate sBTC payments in minutes with our simple API. No complex blockchain knowledge required."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />

          <SpotlightCard
            title="Secure & Reliable"
            description="Built on Stacks blockchain with enterprise-grade security. Your transactions are safe and verifiable."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <SpotlightCard
            title="Developer Friendly"
            description="REST API, webhooks, and comprehensive documentation. Build exactly what you need."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1-1H5a1 1 0 01-1-1V4z" />
              </svg>
            }
          />
        </div>

        {/* Demo Section */}
        {showDemo && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Demo Payment Widget
            </h2>
            <PaymentWidget
              amount={1000000} // 0.01 sBTC
              description="Demo Payment - Test Transaction"
              merchantAddress="ST2T5QMZ2AS5N2P6V0S51EVYVKV32QD44DR9T3FRR"
              onSuccess={(paymentId) => {
                console.log('Payment successful:', paymentId);
              }}
              onError={(error) => {
                console.error('Payment error:', error);
              }}
            />
          </div>
        )}

        {/* Code Examples */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Simple Integration
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SpotlightCard
              title="Create Payment Intent"
              description="Start accepting payments with a simple API call"
            >
              <div className="bg-secondary rounded-lg p-4">
                <pre className="text-primary text-sm overflow-x-auto">
{`POST /api/payments
{
  "amount": 1000000,
  "description": "Premium Plan",
  "merchantAddress": "ST1...",
  "clientReference": "order_123"
}`}
                </pre>
              </div>
            </SpotlightCard>

            <SpotlightCard
              title="Embed Payment Widget"
              description="Drop-in React component for instant payments"
            >
              <div className="bg-secondary rounded-lg p-4">
                <pre className="text-primary text-sm overflow-x-auto">
{`<PaymentWidget
  amount={1000000}
  description="Premium Plan"
  merchantAddress="ST1..."
  onSuccess={handleSuccess}
/>`}
                </pre>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Stats */}
        <SpotlightCard
          title="Why Choose Prism?"
          description="Built for developers, loved by merchants"
          className="mt-20 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-yellow-500/20 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-6">
            <div>
              <div className="text-4xl font-heading font-black text-primary mb-2">2.5%</div>
              <div className="text-gray-600 font-sans">Transaction Fee</div>
            </div>
            <div>
              <div className="text-4xl font-heading font-black text-primary mb-2">&lt;6</div>
              <div className="text-gray-600 font-sans">Bitcoin Blocks</div>
            </div>
            <div>
              <div className="text-4xl font-heading font-black text-primary mb-2">1:1</div>
              <div className="text-gray-600 font-sans">sBTC to BTC Peg</div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
