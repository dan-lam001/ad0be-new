import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Verified = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // First animation - show checkmark
    const verifiedTimer = setTimeout(() => setIsVerified(true), 1000);

    // Redirect timer
    const redirectTimer = setTimeout(() => {
      navigate('/verified/photo-gallery', { state: { email } });
    }, 5500);

    return () => {
      clearTimeout(verifiedTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, email]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className={`
        transition-all duration-1000 ease-in-out
        ${isVerified ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        flex flex-col items-center
      `}>
        <div className="
          bg-white rounded-lg 
          px-6 py-2 mb-4
          shadow-md 
          border border-gray-200
          text-gray-700
        ">
          <p className="text-sm font-medium tracking-wider">{email}</p>
        </div>
        <CheckCircle 
          size={150} 
          className={`
            mb-4 
            ${isVerified 
              ? 'text-green-500 animate-bounce' 
              : 'text-gray-300'}
          `}
        />
        <h1 className={`
          text-3xl font-bold mb-4
          ${isVerified ? 'text-green-600' : 'text-gray-500'}
          transition-colors
        `}>
          Verified Successfully
        </h1>
        <p className={`
          text-lg text-gray-600
          ${isVerified ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-500
        `}>
          Redirecting to gallery...
        </p>
      </div>
    </div>
  );
};

export default Verified;