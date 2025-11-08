"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Receipt({ userData }: { userData?: any }) {
  const { theme } = useTheme();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 🎨 Dynamic theme-based styles
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const textColor =
    theme === "utopia" ? "text-cyan-300" : "text-amber-400";
  const borderColor =
    theme === "utopia" ? "border-cyan-400/30" : "border-amber-500/30";
  const gradientFrom =
    theme === "utopia"
      ? "from-cyan-500/10 to-blue-500/5"
      : "from-amber-700/15 to-orange-900/10";
  const boxShadow = `0 0 20px ${glow}33, inset 0 0 15px ${glow}22`;

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/payment/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setPaymentData(data);
        }
      } catch (err) {
        console.error('Error fetching payment status:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentStatus();
  }, []);

  // Listen for download trigger from parent
  useEffect(() => {
    const checkDownloadTrigger = () => {
      const shouldDownload = sessionStorage.getItem('downloadReceipt');
      if (shouldDownload === 'true' && paymentData?.isPaid && userData) {
        // Use setTimeout to ensure paymentData is available
        setTimeout(() => {
          handleDownloadReceipt();
          sessionStorage.removeItem('downloadReceipt');
        }, 100);
      }
    };
    
    if (paymentData && userData) {
      checkDownloadTrigger();
    }
  }, [paymentData, userData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePayNow = async () => {
    setPaymentLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      
      // Create Razorpay order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
        const errorText = orderData.details 
          ? `${orderData.error}: ${orderData.details}`
          : orderData.error || 'Failed to create order';
        setMessage({ type: 'error', text: errorText });
        setPaymentLoading(false);
        return;
      }

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => initRazorpay(orderData);
        script.onerror = () => {
          setMessage({ type: 'error', text: 'Failed to load Razorpay' });
          setPaymentLoading(false);
        };
        document.body.appendChild(script);
      } else {
        initRazorpay(orderData);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      setPaymentLoading(false);
    }
  };

  const initRazorpay = (orderData: any) => {
    const options = {
      key: orderData.razorpayKeyId,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      order_id: orderData.order.id,
      name: 'OJASS 2026',
      description: 'Registration Fee',
      prefill: {
        email: userData?.email || '',
        contact: userData?.phone || '',
      },
      handler: async (response: any) => {
        try {
          const token = localStorage.getItem('token');
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          
          const verifyData = await verifyRes.json();
          
          if (verifyRes.ok && verifyData.success) {
            setMessage({ type: 'success', text: 'Payment successful!' });
            
            // Update user in localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...user, isPaid: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Refresh payment status
            setTimeout(() => window.location.reload(), 1500);
          } else {
            setMessage({ type: 'error', text: verifyData.error || 'Payment verification failed' });
          }
        } catch (err) {
          setMessage({ type: 'error', text: 'Payment verification error' });
        } finally {
          setPaymentLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setPaymentLoading(false);
        }
      }
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleDownloadReceipt = () => {
    if (!paymentData || !userData) return;
    
    const paymentDate = paymentData.paymentDate 
      ? new Date(paymentData.paymentDate).toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'N/A';

    const paymentTime = paymentData.paymentDate 
      ? new Date(paymentData.paymentDate).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'N/A';

    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Colors (as tuples for TypeScript)
    const primaryColor: [number, number, number] = [0, 150, 200]; // Cyan-blue
    const darkColor: [number, number, number] = [20, 20, 30]; // Dark blue
    const successColor: [number, number, number] = [0, 200, 0]; // Green
    const textColor: [number, number, number] = [40, 40, 40]; // Dark gray

    // Header Section
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('OJASS 2026', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Payment Receipt', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('National Institute of Technology, Jamshedpur', 105, 38, { align: 'center' });

    // Receipt Details Section
    let yPos = 65;
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEIPT DETAILS', 20, yPos);
    
    yPos += 8;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 10;
    
    // Receipt information table
    const receiptData = [
      ['Receipt ID', paymentData.orderId || 'N/A'],
      ['Payment ID', paymentData.razorpayPaymentId || 'N/A'],
      ['Date', paymentDate.split(',')[0] || 'N/A'],
      ['Time', paymentTime || 'N/A'],
      ['Status', 'Paid'],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: receiptData,
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { 
          cellWidth: 50,
          fontStyle: 'bold',
          textColor: [textColor[0], textColor[1], textColor[2]],
        },
        1: { 
          cellWidth: 120,
          textColor: [60, 60, 60],
        },
      },
      margin: { left: 20, right: 20 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // User Information Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('USER INFORMATION', 20, yPos);
    
    yPos += 8;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    const userData_table = [
      ['Name', userData.name || 'N/A'],
      ['OJASS ID', userData.ojassId || 'N/A'],
      ['Email', userData.email || 'N/A'],
      ['Phone', userData.phone || 'N/A'],
      ['College', userData.college || 'N/A'],
      ['City', userData.city || 'N/A'],
      ['State', userData.state || 'N/A'],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: userData_table,
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: { 
          cellWidth: 50,
          fontStyle: 'bold',
          textColor: [textColor[0], textColor[1], textColor[2]],
        },
        1: { 
          cellWidth: 120,
          textColor: [60, 60, 60],
        },
      },
      margin: { left: 20, right: 20 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Payment Summary Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT SUMMARY', 20, yPos);
    
    yPos += 8;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Amount box with highlight (light background)
    // Light blue background
    doc.setFillColor(230, 245, 250);
    doc.roundedRect(20, yPos, 170, 25, 3, 3, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Amount Paid:', 30, yPos + 10);
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`₹${paymentData.paymentAmount?.toFixed(2) || '0.00'}`, 30, yPos + 20);

    // Status badge with border
    doc.setFillColor(240, 255, 240);
    doc.circle(160, yPos + 10, 10, 'F');
    doc.setDrawColor(successColor[0], successColor[1], successColor[2]);
    doc.setLineWidth(1.5);
    doc.circle(160, yPos + 10, 10, 'D');
    doc.setFillColor(successColor[0], successColor[1], successColor[2]);
    doc.circle(160, yPos + 10, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('✓', 157.5, yPos + 13);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Paid', 175, yPos + 13);

    yPos += 35;

    // Transaction Details Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TRANSACTION DETAILS', 20, yPos);
    
    yPos += 8;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    const transactionData = [
      ['Payment Gateway', 'Razorpay'],
      ['Payment Method', 'Online'],
      ['Razorpay Order ID', paymentData.razorpayOrderId || 'N/A'],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: transactionData,
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: { 
          cellWidth: 50,
          fontStyle: 'bold',
          textColor: [textColor[0], textColor[1], textColor[2]],
        },
        1: { 
          cellWidth: 120,
          textColor: [60, 60, 60],
        },
      },
      margin: { left: 20, right: 20 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Footer Section
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 30;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, footerY, 190, footerY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('This is a system generated receipt.', 105, footerY + 8, { align: 'center' });
    doc.text('Thank you for your registration!', 105, footerY + 14, { align: 'center' });

    // Save the PDF
    const fileName = `OJASS_Receipt_${paymentData.orderId || Date.now()}.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return <div className="text-cyan-400 text-center">Loading payment details...</div>;
  }

  const isEmailVerified = userData?.isEmailVerified || paymentData?.isEmailVerified || false;
  const isPaid = paymentData?.isPaid || false;

  // If email not verified, show message
  if (!isEmailVerified) {
    return (
      <div className="space-y-3">
        <div
          className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
          style={{
            clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow,
          }}
        >
          <div className={`text-sm font-semibold ${textColor} mb-3`}>
            EMAIL VERIFICATION REQUIRED
          </div>
          <div className="text-gray-300 text-sm">
            <p>Please verify your email address in the Profile section to proceed with payment.</p>
          </div>
        </div>
      </div>
    );
  }

  // If email verified but not paid, show payment option
  if (!isPaid) {
    return (
      <div className="space-y-3">
        <div
          className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
          style={{
            clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow,
          }}
        >
          <div className={`text-sm font-semibold ${textColor} mb-3`}>
            PAYMENT STATUS
          </div>
          <div className="text-gray-300 text-sm mb-4">
            <p className="mb-2">Registration payment is pending.</p>
            <p className="text-xs mb-2">Email verified ✓</p>
            <p className="text-xs">Please complete your payment to access all features.</p>
          </div>
          {message && (
            <div className={`mb-3 p-2 text-xs rounded ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500' : 'bg-red-500/20 text-red-300 border border-red-500'}`}>
              {message.text}
            </div>
          )}
          <button
            onClick={handlePayNow}
            disabled={paymentLoading}
            className={`w-full py-2 px-4 border-2 ${borderColor} ${textColor} hover:bg-opacity-20 transition-all disabled:opacity-50`}
            style={{ clipPath: "polygon(5% 0, 95% 0, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0 75%, 0 25%)" }}
          >
            {paymentLoading ? 'PROCESSING...' : 'PAY NOW'}
          </button>
        </div>
      </div>
    );
  }

  const paymentDate = paymentData.paymentDate 
    ? new Date(paymentData.paymentDate).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      })
    : 'N/A';

  const paymentTime = paymentData.paymentDate 
    ? new Date(paymentData.paymentDate).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A';

  return (
    <div className="space-y-4">
      {/* 🎫 Receipt Header */}
      <div
        className={`p-6 border-2 ${borderColor} bg-gradient-to-br ${gradientFrom} backdrop-blur-md transition-all duration-300 text-center`}
        style={{
          clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          boxShadow: `0 0 30px ${glow}50, inset 0 0 20px ${glow}20`,
        }}
      >
        <div className={`text-2xl font-bold ${textColor} mb-2`} style={{ textShadow: `0 0 10px ${glow}` }}>
          OJASS 2026
        </div>
        <div className={`text-sm ${textColor} opacity-80 mb-1`}>
          Payment Receipt
        </div>
        <div className="text-xs text-gray-400">
          National Institute of Technology, Jamshedpur
        </div>
      </div>

      {/* 💳 Receipt Details Section */}
      <div
        className={`p-5 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow,
        }}
      >
        <div className={`text-sm font-semibold ${textColor} mb-4 uppercase tracking-wider`}>
          Receipt Details
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Receipt ID</span>
            <span className="text-gray-300 font-mono text-xs">{paymentData.orderId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Payment ID</span>
            <span className="text-gray-300 font-mono text-xs break-all text-right">{paymentData.razorpayPaymentId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Date</span>
            <span className="text-gray-300">{paymentDate}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Time</span>
            <span className="text-gray-300">{paymentTime}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className={`${textColor} font-medium`}>Status</span>
            <span className="text-green-400 font-bold flex items-center gap-1">
              <span>✓</span> Paid
            </span>
          </div>
        </div>
      </div>

      {/* 👤 User Information Section */}
      <div
        className={`p-5 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow,
        }}
      >
        <div className={`text-sm font-semibold ${textColor} mb-4 uppercase tracking-wider`}>
          User Information
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Name</span>
            <span className="text-gray-300 text-right">{userData?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>OJASS ID</span>
            <span className="text-gray-300 font-mono">{userData?.ojassId || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Email</span>
            <span className="text-gray-300 text-right text-xs break-all">{userData?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Phone</span>
            <span className="text-gray-300">{userData?.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>College</span>
            <span className="text-gray-300 text-right">{userData?.college || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>City</span>
            <span className="text-gray-300">{userData?.city || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className={`${textColor} font-medium`}>State</span>
            <span className="text-gray-300">{userData?.state || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 💰 Payment Summary Section */}
      <div
        className={`p-5 border-2 ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300 relative overflow-hidden`}
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow: `0 0 40px ${glow}60, inset 0 0 30px ${glow}25`,
          background: `linear-gradient(135deg, ${theme === 'utopia' ? 'rgba(0,255,255,0.2)' : 'rgba(204,119,34,0.2)'} 0%, ${theme === 'utopia' ? 'rgba(0,150,255,0.1)' : 'rgba(180,90,0,0.1)'} 100%)`,
        }}
      >
        <div className={`text-sm font-semibold ${textColor} mb-4 uppercase tracking-wider`}>
          Payment Summary
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className={`${textColor} font-medium text-base`}>Amount Paid</span>
            <span className={`${textColor} font-bold text-2xl`} style={{ textShadow: `0 0 10px ${glow}` }}>
              ₹{paymentData.paymentAmount?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `rgba(0,200,0,0.2)`, border: `2px solid rgba(0,200,0,0.5)` }}>
              <span className="text-green-400 text-xs font-bold">✓</span>
            </div>
            <span className="text-green-400 font-semibold">Payment Confirmed</span>
          </div>
        </div>
      </div>

      {/* ⚙️ Transaction Details Section */}
      <div
        className={`p-5 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow,
        }}
      >
        <div className={`text-sm font-semibold ${textColor} mb-4 uppercase tracking-wider`}>
          Transaction Details
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Payment Gateway</span>
            <span className="text-gray-300">Razorpay</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-opacity-20" style={{ borderColor: glow }}>
            <span className={`${textColor} font-medium`}>Payment Method</span>
            <span className="text-gray-300">Online</span>
          </div>
          <div className="flex justify-between items-start py-2">
            <span className={`${textColor} font-medium`}>Razorpay Order ID</span>
            <span className="text-gray-300 font-mono text-xs break-all text-right">{paymentData.razorpayOrderId || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 📄 Footer Note */}
      <div className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300 text-center`}
        style={{
          clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow,
        }}
      >
        <p className="text-xs text-gray-400 italic mb-2">
          This is a system generated receipt.
        </p>
        <p className={`text-xs ${textColor} opacity-70`}>
          Thank you for your registration!
        </p>
      </div>

      {/* Download Receipt Button */}
      <div className="mt-4">
        <button
          onClick={handleDownloadReceipt}
          className={`w-full py-3 px-4 border-2 ${borderColor} ${textColor} hover:bg-opacity-20 transition-all font-bold`}
          style={{ 
            clipPath: "polygon(5% 0, 95% 0, 100% 25%, 100% 75%, 95% 100%, 5% 100%, 0 75%, 0 25%)",
            boxShadow: `0 0 20px ${glow}40`
          }}
        >
          DOWNLOAD RECEIPT (PDF)
        </button>
      </div>
    </div>
  );
}
