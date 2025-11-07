"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { X } from "lucide-react";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
}: EmailVerificationModalProps) {
  const { theme } = useTheme();
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const textColor = theme === "utopia" ? "text-cyan-300" : "text-amber-400";
  const borderColor = theme === "utopia" ? "border-cyan-400/70" : "border-amber-500/70";
  const gradientFrom = theme === "utopia"
    ? "from-cyan-500/20 to-blue-500/10"
    : "from-amber-700/20 to-orange-900/10";
  const boxShadow = `0 0 40px ${glow}50, inset 0 0 30px ${glow}20`;

  useEffect(() => {
    if (isOpen && !emailOtpSent) {
      handleSendEmailVerification();
    }
  }, [isOpen]);

  const handleSendEmailVerification = async () => {
    setSendingOtp(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/send-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (res.ok) {
        setEmailOtpSent(true);
        setMessage({ type: 'success', text: data.message || 'Verification email has been sent to your email!' });
        if (process.env.NODE_ENV === 'development' && data.otp) {
          console.log('Email OTP:', data.otp);
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send verification email' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setVerifyingEmail(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: parseInt(emailOtp) })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Email verified successfully!' });
        
        // Update user in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...user, isEmailVerified: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Call success callback
        setTimeout(() => {
          onVerificationSuccess();
          onClose();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid OTP' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setVerifyingEmail(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md z-[101]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative border-2 ${borderColor} bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl p-8 shadow-2xl`}
          style={{
            clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            boxShadow,
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 ${textColor} hover:opacity-70 transition-opacity`}
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className={`text-2xl font-bold ${textColor} mb-2 tracking-wider drop-shadow-[0_0_10px_${glow}]`}>
              VERIFY EMAIL
            </h2>
            <p className="text-gray-300 text-sm">
              Enter the 6-digit code sent to <span className={`${textColor} font-semibold`}>{email}</span>
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className={`mb-4 p-3 rounded text-sm ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-300 border border-green-500' 
                : 'bg-red-500/20 text-red-300 border border-red-500'
            }`}>
              {message.text}
            </div>
          )}

          {/* OTP Input */}
          {emailOtpSent && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full bg-slate-900/50 border-2 border-cyan-400/60 px-4 py-4 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-cyan-400 transition-all"
                  style={{
                    clipPath: "polygon(5% 0, 95% 0, 100% 20%, 100% 80%, 95% 100%, 5% 100%, 0 80%, 0 20%)",
                    boxShadow: `0 0 20px ${glow}30`,
                  }}
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleVerifyEmail}
                  disabled={emailOtp.length !== 6 || verifyingEmail}
                  className={`flex-1 py-3 px-6 border-2 ${borderColor} ${textColor} font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-20`}
                  style={{
                    clipPath: "polygon(8% 0, 92% 0, 100% 30%, 100% 70%, 92% 100%, 8% 100%, 0 70%, 0 30%)",
                    boxShadow: emailOtp.length === 6 ? `0 0 20px ${glow}40` : 'none',
                  }}
                >
                  {verifyingEmail ? 'VERIFYING...' : 'VERIFY'}
                </button>
                <button
                  onClick={handleSendEmailVerification}
                  disabled={sendingOtp}
                  className={`py-3 px-4 border-2 ${borderColor} ${textColor} transition-all disabled:opacity-50 hover:bg-opacity-20`}
                  style={{
                    clipPath: "polygon(8% 0, 92% 0, 100% 30%, 100% 70%, 92% 100%, 8% 100%, 0 70%, 0 30%)",
                  }}
                >
                  {sendingOtp ? 'SENDING...' : 'RESEND'}
                </button>
              </div>
            </div>
          )}

          {!emailOtpSent && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Sending verification email...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

