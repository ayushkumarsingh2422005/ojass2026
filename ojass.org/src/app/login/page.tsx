"use client"
import { register } from 'module';
import { redirect } from 'next/dist/server/api-utils';
import React, { useEffect } from 'react'
import { useRef, useState } from 'react';
import { useRouter } from "next/navigation"

type Props = {}

export default function LoginPage({ }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [activeForm, setActiveForm] = useState<'participant' | 'ambassador' | 'register' | 'forgot' | null>('participant');
  const [showPassword, setShowPassword] = useState({ login: false, register: false });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState({ otp: false, new: false, confirm: false });
  const [forgotStep, setForgotStep] = useState(1);
  const handleSendEmail = () => {
    if (email.trim()) {
      setForgotStep(2);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.trim() && otp.length === 6) {
      setForgotStep(3);
    }
  };

  const handleSetPassword = () => {
    if (newPassword.trim() && forgotConfirmPassword.trim() && newPassword === forgotConfirmPassword) {
      setForgotStep(4);
      setTimeout(() => {
        setEmail('');
        setOtp('');
        setNewPassword('');
        setForgotConfirmPassword('');
        setForgotStep(1);
        setActiveForm('participant');
      }, 2000);
    }
  };



  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log("Autoplay blocked:", err));
    }
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    const formTimer = setTimeout(() => {
      setShowForm(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(formTimer);
    };
  }, []);

  const handleLogin = () => {
    console.log('Login clicked', { username, password, type: activeForm });
    router.push('/dashboard');
  };

  const handleRegister = () => {
    console.log('Register clicked', { username, email, password, confirmPassword });
    router.push('/dashboard');
  };

  return (
    <div className='fixed w-full h-full overflow-hidden bg-black'>

      <img
        src="/login/space-bg.png"
        alt="Background"
        className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${fadeOut ? "opacity-100" : "opacity-0"
          }`}
      />

      <img
        src="/login/spacecraft.png"
        alt="Background"
        className={`absolute w-full h-full object-cover transition-all duration-2000 ${fadeOut ? "scale-[1]" : "scale-[0.1]"
          }`}
      />

      <div
        className={`fixed w-full h-full object-cover overflow-hidden transition-opacity duration-1000 ${fadeOut ? "opacity-0 " : "opacity-100"
          }`}
      >
        <video
          ref={videoRef}
          src="/login/vid.mp4"
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>


      <div className={`fixed inset-0 flex items-center justify-center transition-all duration-1000 ${showForm ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-[3rem] blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -inset-4 bg-cyan-400/30 rounded-[3rem] blur-2xl"></div>

          <div className="relative bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 backdrop-blur-xl border-4 border-cyan-400 rounded-[3rem] p-8 shadow-2xl shadow-cyan-500/50"
            style={{
              boxShadow: '0 0 60px rgba(34, 211, 238, 0.4), inset 0 0 60px rgba(34, 211, 238, 0.05)',
              clipPath: 'polygon(3% 0, 97% 0, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0 97%, 0 3%)',
            }}
            >
            <div className="flex gap-8">


              <div className="flex flex-col gap-6 min-w-[280px]">
                <div className="relative border-2 border-cyan-400/70 p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md overflow-hidden"
                  style={{
                    boxShadow: '0 0 30px rgba(34, 211, 238, 0.2), inset 0 0 30px rgba(34, 211, 238, 0.03)',
                    clipPath: 'polygon(8% 0, 92% 0, 100% 8%, 100% 100%, 0 100%, 0 8%)',
                  }}
                  >

                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/10 to-transparent"></div>

                  <h2 className="text-cyan-400 text-2xl font-bold mb-6 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">LOGIN</h2>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => setActiveForm('participant')}
                      className={`relative border-2 px-8 py-3 text-white font-medium transition-all overflow-hidden group ${activeForm === 'participant' ? 'border-cyan-400 bg-cyan-400/20' : 'border-cyan-400'
                        }`}
                      style={{
                        boxShadow: activeForm === 'participant' ? '0 0 30px rgba(34, 211, 238, 0.5)' : '0 0 20px rgba(34, 211, 238, 0.3)',
                        clipPath: 'polygon(5% 0, 95% 0, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0 75%, 0 25%)',
                      }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Participant Login</span>
                    </button>
                    <button
                      onClick={() => setActiveForm('ambassador')}
                      className={`relative border-2 px-8 py-3 text-white font-medium transition-all overflow-hidden group ${activeForm === 'ambassador' ? 'border-cyan-400 bg-cyan-400/20' : 'border-cyan-400'
                        }`}
                      style={{
                        boxShadow: activeForm === 'ambassador' ? '0 0 30px rgba(34, 211, 238, 0.5)' : '0 0 20px rgba(34, 211, 238, 0.3)',
                        clipPath: 'polygon(5% 0, 95% 0, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0 75%, 0 25%)',
                      }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Ambassador Login</span>
                    </button>
                  </div>
                </div>


                <div className="relative border-2 border-cyan-400/70 p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md overflow-hidden"
                  style={{
                    boxShadow: '0 0 30px rgba(34, 211, 238, 0.2), inset 0 0 30px rgba(34, 211, 238, 0.03)',
                    clipPath: 'polygon(0 0, 100% 0, 100% 92%, 92% 100%, 8% 100%, 0 92%)',
                  }}>

                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/10 to-transparent"></div>

                  <h2 className="text-cyan-400 text-2xl font-bold mb-6 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">REGISTER</h2>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => setActiveForm('register')}
                      className={`relative border-2 px-8 py-3 text-white font-medium transition-all overflow-hidden group ${activeForm === 'register' ? 'border-cyan-400 bg-cyan-400/20' : 'border-cyan-400'
                        }`}
                      style={{
                        boxShadow: activeForm === 'register' ? '0 0 30px rgba(34, 211, 238, 0.5)' : '0 0 20px rgba(34, 211, 238, 0.3)',
                        clipPath: 'polygon(5% 0, 95% 0, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0 75%, 0 25%)',
                      }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Register Now</span>
                    </button>
                  </div>
                </div>
              </div>


              <div className="relative border-2 border-cyan-400/70 p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md w-96 overflow-hidden"
                style={{
                  boxShadow: '0 0 30px rgba(34, 211, 238, 0.2), inset 0 0 30px rgba(34, 211, 238, 0.03)',
                  clipPath: 'polygon(8% 0, 100% 0, 100% 92%, 92% 100%, 0 100%, 0 8%)',
                }}>
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent"></div>

                {(activeForm === 'participant' || activeForm === 'ambassador') && (
                  <div className="relative">
                    <h2 className="text-cyan-400 text-2xl font-bold mb-6 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                      {activeForm === 'participant' ? 'PARTICIPANT LOGIN' : 'AMBASSADOR LOGIN'}
                    </h2>

                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-slate-900/30 border-2 border-cyan-400/60 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm"
                        style={{
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                          clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                        }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                        onBlur={(e) => e.target.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                      />

                      <div className="relative">
                        <input
                          type={showPassword.login ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm"
                          style={{
                            boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                            clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                          onBlur={(e) => e.target.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, login: !showPassword.login })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                        >
                          {showPassword.login ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.846 2.778-3.004 5.03-5.84 6.204m-3.702.796A9.955 9.955 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.112-3.205M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.458 12C3.732 16.057 7.523 19 12 19c1.601 0 3.115-.327 4.48-.916M9.88 9.88A3 3 0 0114.12 14.12M9.88 9.88l4.24 4.24M9.88 9.88L7.757 7.757m6.363 6.363L16.243 16.243M3 3l18 18" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={handleLogin}
                        className="relative mt-4 border-2 border-cyan-400 px-8 py-3 text-cyan-400 font-bold text-lg transition-all overflow-hidden group"
                        style={{
                          boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
                          clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
                        }}>
                        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300"></div>
                        <span className="relative group-hover:text-slate-900 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">LOGIN</span>
                      </button>

                      <button
                        onClick={() => setActiveForm('forgot')}
                        className="text-white hover:text-cyan-400 transition-colors text-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                )}



                {activeForm === 'forgot' && (
                  <div className="relative">
                    {forgotStep === 1 && (
                      <>
                        <h2 className="text-cyan-400 text-2xl font-bold mb-2 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          RESET PASSWORD
                        </h2>
                        <p className="text-gray-300 text-sm text-center mb-6 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
                          Enter your email to receive reset instructions
                        </p>

                        <div className="flex flex-col gap-4">
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-900/30 border-2 border-cyan-400/60 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm"
                            style={{
                              boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                              clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                            }}
                            onFocus={(e) => e.target.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                            onBlur={(e) => e.target.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                          />

                          <button
                            onClick={handleSendEmail}
                            className="relative mt-4 border-2 border-cyan-400 px-8 py-3 text-cyan-400 font-bold text-lg transition-all overflow-hidden group"
                            style={{
                              boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
                              clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
                            }}
                          >
                            <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300"></div>
                            <span className="relative group-hover:text-slate-900 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                              SEND OTP
                            </span>
                          </button>

                          <button
                            onClick={() => { setActiveForm('participant'); setForgotStep(1); }}
                            className="text-white hover:text-cyan-400 transition-colors text-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                          >
                            Back to Login
                          </button>
                        </div>
                      </>
                    )}

                    {/* Step 2: OTP Verification */}
                    {forgotStep === 2 && (
                      <>
                        <h2 className="text-cyan-400 text-2xl font-bold mb-2 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          VERIFY OTP
                        </h2>
                        <p className="text-gray-300 text-sm text-center mb-6 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
                          Enter the 6-digit code sent to your email
                        </p>

                        <div className="flex flex-col gap-4">
                          <div className="relative">
                            <input
                              type={showForgotPassword.otp ? "text" : "password"}
                              placeholder="000000"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              maxLength={6}
                              className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-center text-2xl tracking-widest"
                              style={{
                                boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                                clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                              }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                              onBlur={(e) => e.target.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                            />
                            <button
                              type="button"
                              onClick={() => setShowForgotPassword({ ...showForgotPassword, otp: !showForgotPassword.otp })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                            >
                              {showForgotPassword.otp ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.846 2.778-3.004 5.03-5.84 6.204m-3.702.796A9.955 9.955 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.112-3.205M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.458 12C3.732 16.057 7.523 19 12 19c1.601 0 3.115-.327 4.48-.916M9.88 9.88A3 3 0 0114.12 14.12M9.88 9.88l4.24 4.24M9.88 9.88L7.757 7.757m6.363 6.363L16.243 16.243M3 3l18 18" />
                                </svg>
                              )}
                            </button>
                          </div>

                          <button
                            onClick={handleVerifyOtp}
                            disabled={otp.length !== 6}
                            className="relative mt-4 border-2 border-cyan-400 px-8 py-3 text-cyan-400 font-bold text-lg transition-all overflow-hidden group disabled:opacity-50"
                            style={{
                              boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
                              clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
                            }}
                          >
                            <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300"></div>
                            <span className="relative group-hover:text-slate-900 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                              VERIFY OTP
                            </span>
                          </button>

                          <button
                            onClick={() => { setForgotStep(1); setOtp(''); }}
                            className="text-white hover:text-cyan-400 transition-colors text-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                          >
                            Back
                          </button>
                        </div>
                      </>
                    )}

                    {/* Step 3: Set New Password */}
                    {forgotStep === 3 && (
                      <>
                        <h2 className="text-cyan-400 text-2xl font-bold mb-2 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          SET NEW PASSWORD
                        </h2>
                        <p className="text-gray-300 text-sm text-center mb-6 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
                          Create your new password
                        </p>

                        <div className="flex flex-col gap-4">
                          <div className="relative">
                            <input
                              type={showForgotPassword.new ? "text" : "password"}
                              placeholder="New Password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm"
                              style={{
                                boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                                clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                              }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                              onBlur={(e) => e.target.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                            />
                            <button
                              type="button"
                              onClick={() => setShowForgotPassword({ ...showForgotPassword, new: !showForgotPassword.new })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                            >
                              {showForgotPassword.new ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.846 2.778-3.004 5.03-5.84 6.204m-3.702.796A9.955 9.955 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.112-3.205M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.458 12C3.732 16.057 7.523 19 12 19c1.601 0 3.115-.327 4.48-.916M9.88 9.88A3 3 0 0114.12 14.12M9.88 9.88l4.24 4.24M9.88 9.88L7.757 7.757m6.363 6.363L16.243 16.243M3 3l18 18" />
                                </svg>
                              )}
                            </button>
                          </div>

                          <div className="relative">
                            <input
                              type={showForgotPassword.confirm ? "text" : "password"}
                              placeholder="Confirm Password"
                              value={forgotConfirmPassword}
                              onChange={(e) => setForgotConfirmPassword(e.target.value)}
                              className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm"
                              style={{
                                boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                                clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                              }}
                              onFocus={(e) => e.target.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                              onBlur={(e) => e.target.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                            />
                            <button
                              type="button"
                              onClick={() => setShowForgotPassword({ ...showForgotPassword, confirm: !showForgotPassword.confirm })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                            >
                              {showForgotPassword.confirm ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.846 2.778-3.004 5.03-5.84 6.204m-3.702.796A9.955 9.955 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.112-3.205M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.458 12C3.732 16.057 7.523 19 12 19c1.601 0 3.115-.327 4.48-.916M9.88 9.88A3 3 0 0114.12 14.12M9.88 9.88l4.24 4.24M9.88 9.88L7.757 7.757m6.363 6.363L16.243 16.243M3 3l18 18" />
                                </svg>
                              )}
                            </button>
                          </div>

                          {newPassword && forgotConfirmPassword && newPassword !== forgotConfirmPassword && (
                            <p className="text-red-400 text-sm drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]">
                              ✗ Passwords do not match
                            </p>
                          )}

                          <button
                            onClick={handleSetPassword}
                            disabled={!newPassword || !forgotConfirmPassword || newPassword !== forgotConfirmPassword}
                            className="relative mt-4 border-2 border-cyan-400 px-8 py-3 text-cyan-400 font-bold text-lg transition-all overflow-hidden group disabled:opacity-50"
                            style={{
                              boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
                              clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
                            }}
                          >
                            <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300"></div>
                            <span className="relative group-hover:text-slate-900 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                              UPDATE PASSWORD
                            </span>
                          </button>

                          <button
                            onClick={() => { setForgotStep(2); setOtp(''); }}
                            className="text-white hover:text-cyan-400 transition-colors text-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                          >
                            Back
                          </button>
                        </div>
                      </>
                    )}

                    {/* Step 4: Success */}
                    {forgotStep === 4 && (
                      <div className="text-center py-4">
                        <div className="mb-4 text-cyan-400 text-lg drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          ✓ Password Updated Successfully!
                        </div>
                        <p className="text-gray-300 text-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
                          Redirecting to login...
                        </p>
                      </div>
                    )}
                  </div>
                )}



                {activeForm === 'register' && (
                  <div className="relative">
                    <h2 className="text-cyan-400 text-2xl font-bold mb-6 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                      CREATE ACCOUNT
                    </h2>

                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-slate-900/30 border-2 border-cyan-400/60 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm"
                        style={{
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                          clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                        }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                        onBlur={(e) => e.target.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                      />

                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-900/30 border-2 border-cyan-400/60 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm"
                        style={{
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                          clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                        }}
                        onFocus={(e) => e.target.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                        onBlur={(e) => e.target.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)'}
                      />
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Password Field */}
                        <div className="relative flex-1">
                          <input
                            type={showPassword.register ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm rounded-none"
                            style={{
                              boxShadow:
                                '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                              clipPath:
                                'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                            }}
                            onFocus={(e) =>
                            (e.target.style.boxShadow =
                              '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5)')
                            }
                            onBlur={(e) =>
                            (e.target.style.boxShadow =
                              '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)')
                            }
                          />
                          {/* Eye button */}
                          <button
                            type="button"
                            onClick={() => setShowPassword({ ...showPassword, register: !showPassword.register })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                          >
                            {showPassword.register ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.846 2.778-3.004 5.03-5.84 6.204m-3.702.796A9.955 9.955 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.112-3.205M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.458 12C3.732 16.057 7.523 19 12 19c1.601 0 3.115-.327 4.48-.916M9.88 9.88A3 3 0 0114.12 14.12M9.88 9.88l4.24 4.24M9.88 9.88L7.757 7.757m6.363 6.363L16.243 16.243M3 3l18 18" />
                              </svg>
                            )}
                          </button>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative flex-1">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm rounded-none"
                            style={{
                              boxShadow:
                                '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                              clipPath:
                                'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                            }}
                            onFocus={(e) =>
                            (e.target.style.boxShadow =
                              '0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 15px rgba(0, 0, 0, 0.5)')
                            }
                            onBlur={(e) =>
                            (e.target.style.boxShadow =
                              '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)')
                            }
                          />
                          {/* Eye button */}
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                          >
                            {showConfirmPassword ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.846 2.778-3.004 5.03-5.84 6.204m-3.702.796A9.955 9.955 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.112-3.205M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 002.458 12C3.732 16.057 7.523 19 12 19c1.601 0 3.115-.327 4.48-.916M9.88 9.88A3 3 0 0114.12 14.12M9.88 9.88l4.24 4.24M9.88 9.88L7.757 7.757m6.363 6.363L16.243 16.243M3 3l18 18" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>



                      <button
                        onClick={handleRegister}
                        className="relative mt-4 border-2 border-cyan-400 px-8 py-3 text-cyan-400 font-bold text-lg transition-all overflow-hidden group"
                        style={{
                          boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
                          clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
                        }}>
                        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300"></div>
                        <span className="relative group-hover:text-slate-900 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">REGISTER</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}