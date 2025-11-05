"use client";

import React from "react";

export default function Receipt() {
  return (
    <div className="space-y-3">
      {/* Receipt Info */}
      <div
        className="p-4 border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 backdrop-blur-sm"
        style={{
          clipPath:
            "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow: "0 0 15px rgba(0, 255, 255, 0.1)",
        }}
      >
        <div className="text-sm font-semibold text-white mb-3">
          PAYMENT RECEIPT
        </div>
        <div className="space-y-2 text-xs text-gray-300">
          <div className="flex justify-between">
            <span className="text-cyan-400">Receipt ID:</span>{" "}
            <span>RCP-2024-001234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400">Amount:</span> <span>₹500.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400">Date:</span> <span>Nov 14, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400">Status:</span>{" "}
            <span className="text-green-300">Paid</span>
          </div>
        </div>
      </div>

      {/* Transaction Info */}
      <div
        className="p-4 border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 backdrop-blur-sm"
        style={{
          clipPath:
            "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow: "0 0 15px rgba(0, 255, 255, 0.1)",
        }}
      >
        <div className="text-sm font-semibold text-white mb-2">
          Transaction Details
        </div>
        <div className="space-y-2 text-xs text-gray-300">
          <div>
            <span className="text-cyan-400">Transaction ID:</span> TXN-2024-567890
          </div>
          <div>
            <span className="text-cyan-400">Payment Method:</span> Online
          </div>
          <div>
            <span className="text-cyan-400">Gateway:</span> Razorpay
          </div>
          <div>
            <span className="text-cyan-400">Mode:</span> UPI
          </div>
        </div>
      </div>
    </div>
  );
}
