"use client";

import { useEffect, useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    referral: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // FIX: handle window only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref) {
        setForm((f) => ({ ...f, referral: ref }));
      }
    }
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
console.log(form);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Registration failed");
      } else {
        setMsg("Registration successful! Redirecting...");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setMsg("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md text-black space-y-5 p-8 bg-white shadow-lg rounded-xl"
      >
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>

        {msg && (
          <div className="text-center text-sm text-red-500 capitalize">{msg}</div>
        )}

        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            name="phone"
            type="text"
            required
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Referral Code (optional)</label>
          <input
            name="referral"
            type="text"
            value={form.referral}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a className="text-blue-600 font-medium" href="/login">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
