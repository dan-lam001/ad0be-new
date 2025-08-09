import React, { useState } from 'react';
import { User, FileText, LogIn, ArrowRight, Copy, Check } from 'lucide-react';

// Import your actual Link component
import { Link } from "react-router-dom";

function Home() {
  const [copiedUrl, setCopiedUrl] = useState('');

  const copyToClipboard = async (path) => {
    const fullUrl = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(path);
      setTimeout(() => setCopiedUrl(''), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedUrl(path);
      setTimeout(() => setCopiedUrl(''), 2000);
    }
  };

  const navigationItems = [
    {
      to: "/member",
      title: "Members Form",
            description: "Displays all type of mails login",
      icon: User,
      gradient: "from-blue-600 to-blue-800",
      hoverGradient: "from-blue-700 to-blue-900"
    },
    {
      to: "/pdf",
     title: "PDF",
            description: "pdf download button",
      icon: FileText,
      gradient: "from-emerald-600 to-emerald-800",
      hoverGradient: "from-emerald-700 to-emerald-900"
    },
    {
      to: "/login",
       title: "Login",
            description: "office login",
      icon: LogIn,
      gradient: "from-purple-600 to-purple-800",
      hoverGradient: "from-purple-700 to-purple-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
           Welcome Home(all-url)
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Copy your preferred Link and start shooting
          </p>
          {/* <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose your destination and let's get started with your journey
          </p> */}
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.to}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-8 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl transform perspective-1000`}
              >
                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Icon size={32} className="text-white" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/80 mb-6 group-hover:text-white/90 transition-colors">
                    {item.description}
                  </p>
                  
                  {/* Arrow and Copy Link */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white/60 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium mr-2">Get Started</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                    
                    {/* Copy Link Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        copyToClipboard(item.to);
                      }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
                      title="Copy link"
                    >
                      {copiedUrl === item.to ? (
                        <Check size={16} className="text-green-300" />
                      ) : (
                        <Copy size={16} className="text-white/70" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        {/* <div className="text-center mt-16">
          <p className="text-slate-500 text-sm">
            Need help? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default Home;