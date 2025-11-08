"use client";

import React, { useMemo, useState } from "react";
import { CreditCard, Mail, Download, CheckCircle, Verified } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/general/button";
import { useRouter } from "next/navigation";

interface GlassyNeonBoardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  isEmailVerified?: boolean;
  isPaid?: boolean;
  pricing?: any;
  onPaymentClick?: () => void;
  onEmailVerificationClick?: () => void;
  onRegisterNow?: () => void;
  onDownloadReceipt?: () => void;
}

export default function GlassyNeonBoard({
  children,
  title,
  className = "",
  isEmailVerified = false,
  isPaid = false,
  pricing,
  onPaymentClick,
  onEmailVerificationClick,
  onRegisterNow,
  onDownloadReceipt,
}: GlassyNeonBoardProps) {
  const { theme } = useTheme();
  const user = localStorage.getItem('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const gridId = useMemo(() => `grid-${Math.random()}`, []);


  // 🌗 Theme-based dynamic colors
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const textAccent = theme === "utopia" ? "text-cyan-400" : "text-amber-400";
  const textSoft = theme === "utopia" ? "text-cyan-300" : "text-amber-300";
  const gradientFrom =
    theme === "utopia" ? "from-cyan-500/15" : "from-amber-500/15";
  const gradientVia =
    theme === "utopia" ? "via-blue-500/8" : "via-orange-500/8";
  const borderColor =
    theme === "utopia" ? "border-cyan-400/40" : "border-amber-500/40";

  const buttonGradient =
    theme === "utopia"
      ? "linear-gradient(135deg, rgba(0,255,255,0.25), rgba(0,150,255,0.15))"
      : "linear-gradient(135deg, rgba(204,119,34,0.25), rgba(255,180,0,0.15))";

  const buttonHoverGradient =
    theme === "utopia"
      ? "linear-gradient(135deg, rgba(0,255,255,0.35), rgba(0,150,255,0.25))"
      : "linear-gradient(135deg, rgba(204,119,34,0.35), rgba(255,180,0,0.25))";

  const buttonBoxShadow =
    theme === "utopia"
      ? "0 0 30px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.1)"
      : "0 0 30px rgba(204,119,34,0.3), inset 0 0 20px rgba(204,119,34,0.1)";

  const buttonHoverShadow =
    theme === "utopia"
      ? "0 0 40px rgba(0,255,255,0.6), inset 0 0 30px rgba(0,255,255,0.2)"
      : "0 0 40px rgba(204,119,34,0.6), inset 0 0 30px rgba(204,119,34,0.2)";

  const borderShadow =
    theme === "utopia"
      ? "0 0 60px rgba(0,255,255,0.3), inset 0 0 60px rgba(0,255,255,0.08)"
      : "0 0 60px rgba(204,119,34,0.3), inset 0 0 60px rgba(204,119,34,0.08)";

  const handleLogOut = async () => {
    const token = localStorage.getItem('token');
    console.log(token)
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', "null");
        localStorage.setItem('user', "null");
        router.push('/login');
      } else {
        setError(data.error || 'LogOut failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        clipPath:
          "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
      }}
    >
      {/* Background & Neon Border */}
      <div
        className={`absolute inset-0 backdrop-blur-xl bg-gradient-to-br ${gradientFrom} ${gradientVia} to-black/40 border-2 ${borderColor}`}
        style={{
          boxShadow: `${borderShadow}, 0 8px 32px rgba(31, 38, 135, 0.37)`,
        }}
      >
        {/* Grid Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.08 }}
        >
          <defs>
            <pattern
              id={gridId}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={theme === "utopia" ? "rgba(0,255,255,0.2)" : "rgba(204,119,34,0.2)"}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${gridId})`} />
        </svg>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 p-4 ">
        <div className="flex justify-between ">
          {title && (
            <div className={`${textAccent} text-sm font-mono mb-6 tracking-widest`}>
              {title}
            </div>
          )}

          {title === "PROFILE" && user && (
            <Button content={loading ? "LOGGING OUT..." : "LOGOUT"} onClick={handleLogOut} />

          )}
        </div>

        {children}

        {/* Email Verification Button (only under PROFILE and if email is NOT verified) */}
        {title === "PROFILE" && !isEmailVerified && onEmailVerificationClick && (
          <button
            onClick={onEmailVerificationClick}
            className="w-full py-4 px-6 rounded relative overflow-hidden group transition-all duration-300 mt-6 cursor-pointer"
            style={{
              clipPath:
                "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
              background: buttonGradient,
              border: `2px solid ${theme === "utopia"
                ? "rgba(0,255,255,0.5)"
                : "rgba(204,119,34,0.5)"
                }`,
              boxShadow: buttonBoxShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = buttonHoverShadow;
              e.currentTarget.style.background = buttonHoverGradient;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = buttonBoxShadow;
              e.currentTarget.style.background = buttonGradient;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              }}
            />
            <div className="relative flex items-center justify-center gap-3">
              <Mail size={20} className={`${textSoft}`} />
              <span className="text-white font-bold text-xl tracking-wide uppercase">
                Verify Email
              </span>
            </div>
          </button>
        )}

        {/* Payment Button (only under PROFILE, if email is verified but NOT paid) */}
        {title === "PROFILE" && isEmailVerified && !isPaid && onPaymentClick && (
          <div className="mt-6 space-y-3">
            {pricing && (
              <div className={`text-center ${textSoft} mb-2`}>
                <p className="text-sm opacity-70">Registration Fee</p>
                <p className="text-2xl font-bold">₹{pricing.amount}</p>
                {pricing.offerActive && (
                  <p className="text-xs text-green-400 mt-1">Special Offer Active</p>
                )}
              </div>
            )}
            <button
              onClick={onPaymentClick}
              className="w-full py-4 px-6 rounded relative overflow-hidden group transition-all duration-300 cursor-pointer"
              style={{
                clipPath:
                  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                background: buttonGradient,
                border: `2px solid ${theme === "utopia"
                  ? "rgba(0,255,255,0.5)"
                  : "rgba(204,119,34,0.5)"
                  }`,
                boxShadow: buttonBoxShadow,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = buttonHoverShadow;
                e.currentTarget.style.background = buttonHoverGradient;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = buttonBoxShadow;
                e.currentTarget.style.background = buttonGradient;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                }}
              />
              <div className="relative flex items-center justify-center gap-3">
                <CreditCard size={20} className={`${textSoft}`} />
                <span className="text-white font-bold text-xl tracking-wide uppercase">
                  Register Now
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Download Receipt Button (only under PROFILE, if email is verified AND paid) */}
        {title === "PROFILE" && isEmailVerified && isPaid && onDownloadReceipt && (
          <div
            className="w-full py-4 px-6 rounded relative overflow-hidden group transition-all duration-300 mt-6 cursor-pointer"
            style={{
              clipPath:
                "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
              background: buttonGradient,
              border: `2px solid ${theme === "utopia"
                ? "rgba(0,255,255,0.5)"
                : "rgba(204,119,34,0.5)"
                }`,
              boxShadow: buttonBoxShadow,
            }}
          >
            <div
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              }}
            />
            <div className="relative flex items-center justify-center gap-3">
              <Verified size={20} className={`${textSoft}`} />
              <span className="text-white font-bold text-xl tracking-wide uppercase">
                REGISTERED & VERIFIED
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
