'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { User, LogIn, UserPlus, Shield, Settings, LogOut, ChevronDown, Lock, ShieldCheck } from 'lucide-react';

export const UserNavMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-xs font-semibold text-gray-200 transition-all"
        >
          <LogIn className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Sign In</span>
        </Link>
        <Link
          href="/signup"
          className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-electric text-white text-xs font-bold shadow-glowBlue hover:scale-105 transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Sign Up</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/90 border border-brand-blue/40 text-xs font-semibold text-white hover:border-brand-cyan transition-all shadow-sm"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-blue to-brand-violet flex items-center justify-center font-bold text-[10px] text-white">
          {user.fullName.substring(0, 2).toUpperCase()}
        </div>
        <span className="max-w-[100px] truncate hidden sm:inline">{user.fullName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-darkBg-card/95 border border-brand-blue/30 backdrop-blur-xl p-2 shadow-2xl z-50 flex flex-col gap-1 text-xs animate-fadeIn">
          <div className="p-2.5 border-b border-gray-800">
            <p className="font-bold text-white truncate">{user.fullName}</p>
            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-brand-blue/20 text-brand-cyan font-bold text-[10px]">
              {user.userRole}
            </span>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 p-2 rounded-lg text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            <Shield className="w-4 h-4 text-brand-cyan" />
            <span>Personal Dashboard</span>
          </Link>

          <Link
            href="/profile"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 p-2 rounded-lg text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            <User className="w-4 h-4 text-purple-400" />
            <span>Profile Settings</span>
          </Link>

          <Link
            href="/privacy-control"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 p-2 rounded-lg text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Data Control</span>
          </Link>

          <Link
            href="/settings/security"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2 p-2 rounded-lg text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Account Security</span>
          </Link>

          <button
            onClick={() => {
              setDropdownOpen(false);
              logout();
            }}
            className="flex items-center gap-2 p-2 rounded-lg text-red-400 hover:bg-red-950/40 font-bold border-t border-gray-800/80 mt-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
