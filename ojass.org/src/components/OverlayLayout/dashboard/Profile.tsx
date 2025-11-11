"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { User, Code, Users, Zap, Mail, Phone, Shield, Upload, X, Image as ImageIcon, Check } from "lucide-react";

export default function Profile({ profileData }: { profileData: any }) {
  const { theme } = useTheme();
  const [idCardImageUrl, setIdCardImageUrl] = useState<string | null>(profileData?.idCardImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUtopia = theme === "utopia";
  const glow = isUtopia ? "#00ffff" : "#cc7722";
  const textColor = isUtopia ? "text-cyan-300" : "text-amber-400";
  const subTextColor = isUtopia ? "text-gray-400" : "text-amber-200/80";
  const borderColor = isUtopia ? "border-cyan-400" : "border-amber-500";
  const bgGradient = isUtopia
    ? "linear-gradient(135deg, rgba(0,255,255,0.15), rgba(0,100,200,0.08))"
    : "linear-gradient(135deg, rgba(255,180,0,0.15), rgba(180,90,0,0.08))";

  // Fetch ID card on mount
  useEffect(() => {
    const fetchIdCard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/user/id-card', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.idCardImageUrl) {
            setIdCardImageUrl(data.idCardImageUrl);
            // Update profileData in parent if needed
          }
        }
      } catch (err) {
        console.error('Error fetching ID card:', err);
      }
    };
    fetchIdCard();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const userId = profileData?._id;

      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      // Step 1: Upload file to media API
      const formData = new FormData();
      formData.append('files', file);
      formData.append('userId', userId);
      formData.append('isIdCard', 'true');

      const uploadRes = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const uploadData = await uploadRes.json();
      const uploadedFile = uploadData.files[0];

      // Step 2: Update user's ID card fields
      const updateRes = await fetch('/api/user/id-card', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idCardImageUrl: uploadedFile.url,
          idCardCloudinaryId: uploadedFile.cloudinaryId
        })
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        throw new Error(errorData.error || 'Failed to update ID card');
      }

      // Update local state
      setIdCardImageUrl(uploadedFile.url);
      setUploadSuccess(true);

      // Update localStorage user data
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.idCardImageUrl = uploadedFile.url;
      user.idCardCloudinaryId = uploadedFile.cloudinaryId;
      localStorage.setItem('user', JSON.stringify(user));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);

    } catch (err: any) {
      console.error('ID card upload error:', err);
      setUploadError(err.message || 'Failed to upload ID card');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveIdCard = async () => {
    if (!confirm('Are you sure you want to remove your ID card?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/user/id-card', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idCardImageUrl: '',
          idCardCloudinaryId: ''
        })
      });

      if (res.ok) {
        setIdCardImageUrl(null);
        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.idCardImageUrl = null;
        user.idCardCloudinaryId = null;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (err) {
      console.error('Error removing ID card:', err);
    }
  };

  return (
    <div className="space-y-5 relative px-3 pb-8 overflow-y-auto ">
      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-30 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${glow}55, transparent 70%)`,
        }}
      />

      {/* Avatar */}
      <div className="relative flex items-center justify-center mb-6">
        <div
          className="absolute w-28 h-28 rounded-full animate-spin"
          style={{
            border: "2px solid transparent",
            borderTopColor: `${glow}99`,
            borderRightColor: `${glow}66`,
            animationDuration: "3s",
          }}
        />
        <div
          className={`relative w-24 h-24 flex items-center justify-center backdrop-blur-sm border-2 ${borderColor} transition-all duration-300 hover:scale-110`}
          style={{
            clipPath: "circle(50%)",
            background: isUtopia
              ? "linear-gradient(135deg, rgba(0,255,255,0.3), rgba(0,100,200,0.1))"
              : "linear-gradient(135deg, rgba(255,180,0,0.3), rgba(120,60,0,0.1))",
            boxShadow: `0 0 40px ${glow}80, inset 0 0 30px ${glow}30`,
          }}
        >
          <User size={36} className={textColor} />
          <div
            className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center"
            style={{
              background: glow,
              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              boxShadow: `0 0 10px ${glow}`,
            }}
          >
            <Shield size={10} className="text-black absolute top-0 right-0" />
          </div>
        </div>
      </div>

      {/* Name + Ojass ID */}
      <div className="text-center relative">
        <h2
          className={`text-2xl font-bold mb-2 tracking-wide ${textColor}`}
          style={{
            textShadow: `0 0 20px ${glow}`,
          }}
        >
          {profileData.name}
        </h2>
        <div
          className="inline-block px-4 py-1 rounded-sm"
          style={{
            background: isUtopia
              ? "linear-gradient(90deg, rgba(0,255,255,0.25), rgba(0,150,255,0.1))"
              : "linear-gradient(90deg, rgba(255,200,0,0.25), rgba(180,90,0,0.1))",
            border: `1px solid ${glow}55`,
          }}
        >
          <p className={`${textColor} font-mono text-xs tracking-widest`}>
            {profileData.ojassId}
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div
        className={`grid sm:grid-cols-1 lg:grid-cols-2 gap-3 p-5 rounded relative overflow-hidden border ${borderColor}`}
        style={{
          clipPath:
            "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          background: bgGradient,
          boxShadow: `0 0 30px ${glow}40, inset 0 0 20px ${glow}15`,
        }}
      >
        {/* corner glow */}
        <div
          className="absolute top-0 right-0 w-8 h-8"
          style={{
            background: `linear-gradient(135deg, ${glow}66, transparent)`,
            clipPath: "polygon(100% 0, 100% 100%, 0 0)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-8 h-8"
          style={{
            background: `linear-gradient(135deg, transparent, ${glow}66)`,
            clipPath: "polygon(0 100%, 100% 100%, 0 0)",
          }}
        />

        {[
          { icon: Mail, label: "Email", value: profileData.email },
          { icon: Phone, label: "Phone", value: profileData.phone },
          { icon: Zap, label: "College", value: profileData.college },
          { icon: Code, label: "Gender", value: profileData.gender },
          { icon: Users, label: "City", value: profileData.city },
          { icon: Shield, label: "State", value: profileData.state },
          { icon: Users, label: "Referrals", value: profileData.referralCount || 0 },
        ].map(({ icon: Icon, label, value }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 rounded transition-all duration-200 hover:bg-opacity-10 overflow-x-auto"
            style={{
              background: `${glow}10`,
              borderLeft: `2px solid transparent`,
              boxShadow: `inset 0 0 10px ${glow}15`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderLeftColor = glow;
              e.currentTarget.style.boxShadow = `0 0 20px ${glow}66, inset 0 0 15px ${glow}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderLeftColor = "transparent";
              e.currentTarget.style.boxShadow = `inset 0 0 10px ${glow}15`;
            }}
          >
            <div
              className="p-2 rounded"
              style={{
                background: `${glow}20`,
                boxShadow: `0 0 10px ${glow}40`,
              }}
            >
              <Icon size={16} className={textColor} />
            </div>
            <div className="flex-1">
              <span
                className={`${subTextColor} text-xs uppercase tracking-wider`}
              >
                {label}
              </span>
              <p
                className={`${textColor} text-sm font-medium break-words leading-tight`}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ID Card Upload Section */}
      <div
        className={`p-5 rounded relative overflow-hidden border ${borderColor}`}
        style={{
          clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          background: bgGradient,
          boxShadow: `0 0 30px ${glow}40, inset 0 0 20px ${glow}15`,
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon size={20} className={textColor} />
          <h3 className={`${textColor} font-semibold text-sm uppercase tracking-wider`}>
            ID Card
          </h3>
        </div>

        {uploadError && (
          <div className="mb-3 p-2 text-xs rounded bg-red-500/20 text-red-300 border border-red-500">
            {uploadError}
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-3 p-2 text-xs rounded bg-green-500/20 text-green-300 border border-green-500 flex items-center gap-2">
            <Check size={14} />
            ID card uploaded successfully!
          </div>
        )}

        {idCardImageUrl ? (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden border-2" style={{ borderColor: `${glow}40` }}>
              <img
                src={idCardImageUrl}
                alt="ID Card"
                className="w-full h-auto max-h-48 object-contain bg-gray-900/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`flex-1 py-2 px-4 border-2 ${borderColor} ${textColor} hover:bg-opacity-20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold`}
                style={{
                  clipPath: "polygon(5% 0, 95% 0, 100% 30%, 100% 70%, 95% 100%, 5% 100%, 0 70%, 0 30%)",
                }}
              >
                {uploading ? 'UPLOADING...' : 'CHANGE ID CARD'}
              </button>
              <button
                onClick={handleRemoveIdCard}
                disabled={uploading}
                className={`py-2 px-4 border-2 ${borderColor} text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold`}
                style={{
                  clipPath: "polygon(5% 0, 95% 0, 100% 30%, 100% 70%, 95% 100%, 5% 100%, 0 70%, 0 30%)",
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center transition-all hover:border-solid"
              style={{
                borderColor: `${glow}40`,
                background: `${glow}05`,
              }}
            >
              <Upload size={32} className={`${textColor} mx-auto mb-3 opacity-50`} />
              <p className={`${subTextColor} text-xs mb-3`}>
                Upload your ID card (College/University ID)
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`py-2 px-6 border-2 ${borderColor} ${textColor} hover:bg-opacity-20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold`}
                style={{
                  clipPath: "polygon(5% 0, 95% 0, 100% 30%, 100% 70%, 95% 100%, 5% 100%, 0 70%, 0 30%)",
                }}
              >
                {uploading ? 'UPLOADING...' : 'UPLOAD ID CARD'}
              </button>
              <p className={`${subTextColor} text-xs mt-3`}>
                Max size: 10MB | Image formats only
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
