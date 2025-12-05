"use client";

import ActivationPopup from "@/src/components/ActivationPopup";
import { useUser } from "@/src/context/UserContext";
import { useEffect, useState } from "react";



export default function DashboardPage() {

  const { user, loading } = useUser(); // ← synced from server
  const [balance, setBalance] = useState({ fiat: 0, points: 0 });

useEffect(() => {
    async function loadBalance() {
      if (!user) return;

      const res = await fetch("/api/wallet/balance");
      const data = await res.json();
      setBalance(data);
    }
    loadBalance();
  }, [user]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6">Not logged in</div>;
  }
  return (
    <>
    {!user.isActivated && <ActivationPopup user={user} /> }
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="p-4 flex justify-between items-center text-black bg-white shadow-sm">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <a href="/profile" className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center text-sm font-semibold">
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </a>
      </div>

      {/* Wallet Card */}
      <div className="p-4">
        <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg space-y-2">
          <p className="text-sm text-blue-100">Wallet Balance</p>
          <h2 className="text-3xl font-bold">KSH {balance.fiat.toLocaleString()}</h2>
          <p className="text-sm text-blue-100">Points: {balance.points}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 grid grid-cols-4 gap-4 text-center">
        <ActionButton label="Deposit" link="/wallet/deposit" icon="⬆️" />
        <ActionButton label="Withdraw" link="/wallet/withdraw" icon="⬇️" />
        <ActionButton label="Spin" link="/spin" icon="🎡" />
        <ActionButton label="Tasks" link="/tasks" icon="📋" />
      </div>

      {/* Spin CTA */}
      <div className="px-4 mt-6">
        <a
          href="/spin"
          className="block bg-yellow-400 p-4 rounded-xl shadow-md text-center font-semibold"
        >
          🎯 Claim Your Daily Spin
        </a>
      </div>

      {/* Tasks Preview */}
      <div className="mt-8 px-4">
        <h3 className="font-bold text-lg mb-3">Tasks For You</h3>

        <div className="space-y-3">
          <TaskCard
            title="Watch YouTube Ad"
            reward="20 points"
          />

          <TaskCard
            title="Take Quick Survey"
            reward="KSH 15"
          />

          <TaskCard
            title="Download App Offer"
            reward="KSH 30"
          />

          <a href="/tasks" className="text-blue-600 font-medium text-sm mt-2 inline-block">
            View all tasks →
          </a>
        </div>
      </div>

      {/* Referral CTA */}
      <div className="px-4 mt-10">
        <a
          href="/referrals"
          className="block bg-green-500 text-white p-4 rounded-xl shadow-md text-center font-semibold"
        >
          💸 Earn by Referring Friends
        </a>
      </div>
    </div>
    </>
  );
}

function ActionButton({ label, link, icon }: any) {
  return (
    <a href={link} className="flex flex-col items-center">
      <div className="bg-white shadow-md rounded-full w-14 h-14 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <p className="text-xs mt-1 font-medium">{label}</p>
    </a>
  );
}

function TaskCard({ title, reward }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs text-gray-500">Reward: {reward}</p>
      </div>
      <span className="text-blue-600 text-sm font-semibold">Do Task →</span>
    </div>
  );
}
