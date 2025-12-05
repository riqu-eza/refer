"use client";

import { useState } from "react";

type ActivationPopupProps = {
  user: {
    _id: string;
    phone?: string;
  };
};

export default function ActivationPopup({ user }: ActivationPopupProps) {
  const [phoneNumber, setPhone] = useState(user.phone || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/mpesa/stkpush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phoneNumber,
        amount: 1,
        userId: user._id,
      }),
    });

    const data = await res.json();
    if (!res.ok) setMsg(data.error || "Failed");
    else setMsg("STK push sent! Enter PIN to activate.");

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h1 className="text-xl text-cyan-900 font-bold mb-3 text-center">Activate Your Account</h1>
        <p className="text-gray-600 text-sm mb-4 text-center">
          Pay <span className="font-semibold">KSH 50</span> to activate your account.
        </p>

        <input
          type="text"
          className="w-full border p-2 rounded mb-3 text-black"
          value={phoneNumber}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          {loading ? "Sending..." : "Pay with M-Pesa"}
        </button>

        {msg && <p className="text-center text-sm mt-3">{msg}</p>}
      </div>
    </div>
  );
}
