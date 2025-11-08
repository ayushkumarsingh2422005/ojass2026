"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from "next/navigation"
import { FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const formRefs = {
    participant: useRef(null),
    ambassador: useRef(null),
    register: useRef(null),
    forgot: useRef(null)
  };
  
  const router=useRouter();
  const [fadeOut, setFadeOut] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [activeForm, setActiveForm] = useState('participant');
  const [showPassword, setShowPassword] = useState({ login: false, register: false });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState({ otp: false, new: false, confirm: false });
  const [forgotStep, setForgotStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showMobileForm,setShowMobileForm]=useState(false);
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

  const scrollToForm = (formType:string) => {
    setActiveForm(formType);
    setTimeout(() => {
      formRefs[formType]?.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest'
      });
    }, 100);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: username.includes('@') ? username : undefined,
          phone: !username.includes('@') ? username : undefined,
          password 
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: username,
          email,
          phone,
          password,
          gender,
          city,
          state,
          collegeName: email.endsWith('@nitjsr.ac.in') ? undefined : collegeName,
          referralCode: referralCode || undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('OTP sent to your email!');
        setForgotStep(2);
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.trim() && otp.length === 6) {
      setForgotStep(3);
    }
  };

  const handleSetPassword = async () => {
    if (!newPassword.trim() || !forgotConfirmPassword.trim() || newPassword !== forgotConfirmPassword) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: parseInt(otp), newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Password reset successful!');
        setForgotStep(4);
        setTimeout(() => {
          setEmail('');
          setOtp('');
          setNewPassword('');
          setForgotConfirmPassword('');
          setForgotStep(1);
          scrollToForm('participant');
          setSuccess('');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
  function handleResize() {
    if (window.innerWidth <=425) {
      setShowMobileForm(false);
    } else {
      setShowMobileForm(true);
    }
  }

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  return (
    <div className='fixed w-full h-full overflow-hidden bg-black'>

      <img
        src="/login/space-bg.png"
        alt="Background"
        className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${fadeOut ? "opacity-100" : "opacity-0"}`}
      />

      <img
        src="/login/spacecraft.png"
        alt="Spacecraft"
        className={`absolute w-full h-full object-cover transition-all duration-2000 ${fadeOut ? "scale-[1]" : "scale-[0.1]"}`}
      />

      <div className={`fixed w-full h-full object-cover overflow-hidden transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
        <video
          ref={videoRef}
          src="/login/vid.mp4"
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-1000 ${showForm ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
        <div className="relative max-w-6xl">
          <div className="absolute -inset-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-[3rem] blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -inset-4 bg-cyan-400/30 rounded-[3rem] blur-2xl"></div>

          <div className="relative bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 backdrop-blur-xl border-4 border-cyan-400 rounded-[3rem] p-4 md:p-8 shadow-2xl shadow-cyan-500/50 max-h-[90vh] overflow-y-auto"
            style={{
              boxShadow: '0 0 60px rgba(34, 211, 238, 0.4), inset 0 0 60px rgba(34, 211, 238, 0.05)',
              clipPath: 'polygon(3% 0, 97% 0, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0 97%, 0 3%)',
            }}
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 ">
              {/* Left Panel - Login/Register Buttons */}
              <div className="flex flex-col gap-4 lg:gap-6 w-full lg:w-auto lg:min-w-[280px]">
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
                      onClick={() => {setShowMobileForm(true);scrollToForm('participant');}}
                      className={`relative border-2 px-8 py-3 text-white font-medium transition-all overflow-hidden group ${activeForm === 'participant' ? 'border-cyan-400 bg-cyan-400/20' : 'border-cyan-400'}`}
                      style={{
                        boxShadow: activeForm === 'participant' ? '0 0 30px rgba(34, 211, 238, 0.5)' : '0 0 20px rgba(34, 211, 238, 0.3)',
                        clipPath: 'polygon(5% 0, 95% 0, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0 75%, 0 25%)',
                      }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <span className="relative drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Participant Login</span>
                    </button>
                    <button
                      onClick={() =>{setShowMobileForm(true); scrollToForm('ambassador')}}
                      className={`relative border-2 px-8 py-3 text-white font-medium transition-all overflow-hidden group ${activeForm === 'ambassador' ? 'border-cyan-400 bg-cyan-400/20' : 'border-cyan-400'}`}
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
                      onClick={() => {setShowMobileForm(true);scrollToForm('register')}}
                      className={`relative border-2 px-8 py-3 text-white font-medium transition-all overflow-hidden group ${activeForm === 'register' ? 'border-cyan-400 bg-cyan-400/20' : 'border-cyan-400'}`}
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

              {/* Right Panel - Forms */}
             {showMobileForm &&  <div className="relative border-2 border-cyan-400/70 p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md w-full lg:w-96 overflow-hidden"
                style={{
                  boxShadow: '0 0 30px rgba(34, 211, 238, 0.2), inset 0 0 30px rgba(34, 211, 238, 0.03)',
                  clipPath: 'polygon(8% 0, 100% 0, 100% 92%, 92% 100%, 0 100%, 0 8%)',
                }}>
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent"></div>

                {/* Participant Login */}
                {(activeForm === 'participant' || activeForm === 'ambassador') && (
                  <div ref={formRefs[activeForm]} className="relative">
                    <h2 className="text-cyan-400 text-2xl font-bold mb-6 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                      {activeForm === 'participant' ? 'PARTICIPANT LOGIN' : 'AMBASSADOR LOGIN'}
                    </h2>

                    {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 text-sm">{error}</div>}
                    {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500 text-green-300 text-sm">{success}</div>}

                    <div className="flex flex-col gap-4">
                      <input
                        type="text"
                        placeholder="Email or Phone"
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
                          <FaEyeSlash/>
                        </button>
                      </div>

                      <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="relative mt-4 border-2 border-cyan-400 px-8 py-3 text-cyan-400 font-bold text-lg transition-all overflow-hidden group disabled:opacity-50"
                        style={{
                          boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
                          clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
                        }}>
                        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300"></div>
                        <span className="relative group-hover:text-slate-900 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          {loading ? 'LOGGING IN...' : 'LOGIN'}
                        </span>
                      </button>

                      <button
                        onClick={() => scrollToForm('forgot')}
                        className="text-white hover:text-cyan-400 transition-colors text-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                )}

                {/* Forgot Password Form */}
                {activeForm === 'forgot' && (
                  <div ref={formRefs.forgot} className="relative">
                    {forgotStep === 1 && (
                      <>
                        <h2 className="text-cyan-400 text-xl md:text-2xl font-bold mb-2 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          RESET PASSWORD
                        </h2>
                        <p className="text-gray-300 text-xs md:text-sm text-center mb-4 md:mb-6 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
                          Enter your email to receive reset instructions
                        </p>

                        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 text-sm">{error}</div>}
                        {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500 text-green-300 text-sm">{success}</div>}

                        <div className="flex flex-col gap-3 md:gap-4">
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                            style={{
                              boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                              clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                            }}
                          />

                          <button
                            onClick={handleSendEmail}
                            disabled={loading}
                            className="relative mt-2 md:mt-4 border-2 border-cyan-400 px-6 md:px-8 py-2 md:py-3 text-cyan-400 font-bold text-base md:text-lg transition-all overflow-hidden group disabled:opacity-50"
                            style={{
                              boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
                              clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
                            }}
                          >
                            <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300"></div>
                            <span className="relative group-hover:text-slate-900 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                              {loading ? 'SENDING...' : 'SEND OTP'}
                            </span>
                          </button>

                          <button
                            onClick={() => scrollToForm('participant')}
                            className="text-white hover:text-cyan-400 transition-colors text-xs md:text-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                          >
                            Back to Login
                          </button>
                        </div>
                      </>
                    )}

                    {forgotStep === 2 && (
                      <>
                        <h2 className="text-cyan-400 text-xl md:text-2xl font-bold mb-2 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          VERIFY OTP
                        </h2>
                        <p className="text-gray-300 text-xs md:text-sm text-center mb-4 md:mb-6 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
                          Enter the 6-digit code sent to your email
                        </p>

                        <div className="flex flex-col gap-3 md:gap-4">
                          <div className="relative">
                            <input
                              type={showForgotPassword.otp ? "text" : "password"}
                              placeholder="000000"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              maxLength={6}
                              className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 pr-10 md:pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-center text-xl md:text-2xl tracking-widest"
                              style={{
                                boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                                clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowForgotPassword({ ...showForgotPassword, otp: !showForgotPassword.otp })}
                              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                            >
                              <FaEyeSlash/>
                            </button>
                          </div>

                          <button
                            onClick={handleVerifyOtp}
                            disabled={otp.length !== 6}
                            className="relative mt-2 md:mt-4 border-2 border-cyan-400 px-6 md:px-8 py-2 md:py-3 text-cyan-400 font-bold text-base md:text-lg transition-all overflow-hidden group disabled:opacity-50"
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
                            className="text-white hover:text-cyan-400 transition-colors text-xs md:text-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                          >
                            Back
                          </button>
                        </div>
                      </>
                    )}

                    {forgotStep === 3 && (
                      <>
                        <h2 className="text-cyan-400 text-xl md:text-2xl font-bold mb-2 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          SET NEW PASSWORD
                        </h2>
                        <p className="text-gray-300 text-xs md:text-sm text-center mb-4 md:mb-6 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
                          Create your new password
                        </p>

                        <div className="flex flex-col gap-3 md:gap-4">
                          <div className="relative">
                            <input
                              type={showForgotPassword.new ? "text" : "password"}
                              placeholder="New Password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 pr-10 md:pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                              style={{
                                boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                                clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowForgotPassword({ ...showForgotPassword, new: !showForgotPassword.new })}
                              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                            >
                              <FaEyeSlash/>
                            </button>
                          </div>

                          <div className="relative">
                            <input
                              type={showForgotPassword.confirm ? "text" : "password"}
                              placeholder="Confirm Password"
                              value={forgotConfirmPassword}
                              onChange={(e) => setForgotConfirmPassword(e.target.value)}
                              className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 pr-10 md:pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                              style={{
                                boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                                clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowForgotPassword({ ...showForgotPassword, confirm: !showForgotPassword.confirm })}
                              className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                            >
                              <FaEyeSlash/>
                            </button>
                          </div>

                          {newPassword && forgotConfirmPassword && newPassword !== forgotConfirmPassword && (
                            <p className="text-red-400 text-xs md:text-sm drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]">
                              ✗ Passwords do not match
                            </p>
                          )}

                          <button
                            onClick={handleSetPassword}
                            disabled={loading || !newPassword || !forgotConfirmPassword || newPassword !== forgotConfirmPassword}
                            className="relative mt-2 md:mt-4 border-2 border-cyan-400 px-6 md:px-8 py-2 md:py-3 text-cyan-400 font-bold text-base md:text-lg transition-all overflow-hidden group disabled:opacity-50"
                            style={{
                              boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
                              clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
                            }}
                          >
                            <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300"></div>
                            <span className="relative group-hover:text-slate-900 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                            </span>
                          </button>

                          <button
                            onClick={() => { setForgotStep(2); setOtp(''); }}
                            className="text-white hover:text-cyan-400 transition-colors text-xs md:text-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                          >
                            Back
                          </button>
                        </div>
                      </>
                    )}

                    {forgotStep === 4 && (
                      <div className="text-center py-4">
                        <div className="mb-4 text-cyan-400 text-base md:text-lg drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          ✓ Password Updated Successfully!
                        </div>
                        <p className="text-gray-300 text-xs md:text-sm drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
                          Redirecting to login...
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Register Form */}
                {activeForm === 'register' && (
                  <div ref={formRefs.register} className="relative">
                    <h2 className="text-cyan-400 text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center tracking-wider drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                      CREATE ACCOUNT
                    </h2>

                    {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 text-xs md:text-sm">{error}</div>}
                    {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500 text-green-300 text-xs md:text-sm">{success}</div>}

                    <div className="flex flex-col gap-3 md:gap-4 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500/40">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                        style={{
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                          clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                        }}
                      />

                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                        style={{
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                          clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                        }}
                      />

                      <input
                        type="tel"
                        placeholder="Phone (10 digits)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                        style={{
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                          clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                        }}
                      />

                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 text-white focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                        style={{
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                          clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>

                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                        style={{
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                          clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                        }}
                      />

                      <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                        style={{
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                          clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                        }}
                      />

                      {!email.endsWith('@nitjsr.ac.in') && (
                        <input
                          type="text"
                          placeholder="College Name"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          className="bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                          style={{
                            boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                            clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                          }}
                        />
                      )}

                      <input
                        type="text"
                        placeholder="Referral Code (Optional)"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        className="bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                        style={{
                          boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                          clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                        }}
                      />

                      <div className="flex flex-col gap-3 md:gap-4">
                        <div className="relative">
                          <input
                            type={showPassword.register ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 pr-10 md:pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                            style={{
                              boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                              clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword({ ...showPassword, register: !showPassword.register })}
                            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                          >
                            <FaEyeSlash/>
                          </button>
                        </div>

                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-900/30 border-2 border-cyan-400/60 px-3 md:px-4 py-2 pr-10 md:pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-all backdrop-blur-sm text-sm md:text-base"
                            style={{
                              boxShadow: '0 0 15px rgba(34, 211, 238, 0.2), inset 0 0 15px rgba(0, 0, 0, 0.5)',
                              clipPath: 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition"
                          >
                           <FaEyeSlash/>
                          </button>
                        </div>
                      </div>

                     <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="relative flex justify-center items-center border-2 border-cyan-400 px-6 md:px-8 py-4 md:py-6 text-cyan-400 font-bold text-base md:text-lg transition-all overflow-hidden group disabled:opacity-50"
                        style={{
                          boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)',
                          clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)',
                        }}
                      >
                        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300"></div>
                        <span 
                        className="relative group-hover:text-slate-900 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          {loading ? 'REGISTERING...' : 'REGISTER'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}