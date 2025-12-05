"use client";

import { useRouter } from "next/navigation";
import {  useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // useEffect(() => {
  //   if (!loading && user) {
  //     router.push("/dashboard");
  //   }
  // } )
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Login failed");
      } else {
        setMsg("Login successful! Redirecting...");
        await new Promise((resolve) => setTimeout(resolve, 120));
        console.log("Redirecting to dashboard");
        console.log(data);
        router.push("/dashboard");
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
        className="w-full max-w-md space-y-5 p-8 bg-white shadow-lg rounded-xl"
      >
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>

        {msg && (
          <div className="text-center text-sm text-red-500 capitalize">
            {msg}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="text"
            required
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

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <a className="text-blue-600 font-medium" href="/register">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
function login(user: any) {
  throw new Error("Function not implemented.");
}
