'use client';

import React, { useEffect, useState } from 'react';
import { getProfileAction, updateProfileAction } from '@/app/actions/customer';
import { User, Phone, Mail, MapPin, Save, ArrowLeft, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function CustomerProfilePage() {
  const [phone, setPhone] = useState('9876543210');
  const [inputPhone, setInputPhone] = useState('9876543210');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async (searchPhone?: string) => {
    if (!searchPhone) return;
    setLoading(true);
    const res = await getProfileAction(searchPhone);
    if (res.success && res.data) {
      const u = res.data;
      setPhone(u.phone || searchPhone);
      setInputPhone(u.phone || searchPhone);
      setName(u.name || '');
      setEmail(u.email || '');
      setAlternatePhone(u.alternatePhone || '');
      setAddress(u.address || '');
      setCity(u.city || '');
      setState(u.state || '');
      setPincode(u.pincode || '');
    } else {
      setPhone(searchPhone);
      setInputPhone(searchPhone);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile(phone);
  }, []);

  const handlePhoneLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPhone.trim()) {
      fetchProfile(inputPhone.trim());
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim() === '') {
      alert('Please enter a primary mobile phone number.');
      return;
    }
    setLoading(true);
    const res = await updateProfileAction(phone, {
      name,
      phone,
      email,
      alternatePhone,
      address,
      city,
      state,
      pincode
    });
    if (res.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } else {
      alert(res.error || 'Failed to save profile changes.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <Link href="/customer" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center mb-1">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Customer Portal
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Customer Account Profile</h1>
        </div>

        {/* Dynamic User Profile Switcher */}
        <form onSubmit={handlePhoneLoad} className="flex items-center space-x-2 bg-slate-50 dark:bg-zinc-950 p-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <Phone className="w-4 h-4 text-amber-600 ml-2" />
          <input
            type="text"
            value={inputPhone}
            onChange={(e) => setInputPhone(e.target.value)}
            placeholder="Load Mobile #"
            className="px-2 py-1.5 bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none w-36"
          />
          <button type="submit" className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-extrabold rounded-xl transition flex items-center">
            <RefreshCw className="w-3 h-3 mr-1" /> Load User
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-8 max-w-3xl mx-auto shadow-xs">
        {savedSuccess && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center text-emerald-600 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Profile information updated & saved to PostgreSQL database!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="border-b border-slate-200/60 dark:border-zinc-800 pb-4 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Personal Contact Details</h3>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Editing Profile: #{phone}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Pooja Sharma"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Primary Mobile Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setInputPhone(e.target.value);
                }}
                onBlur={() => fetchProfile(phone)}
                placeholder="Enter 10-digit mobile number"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@poojatravels.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Alternate Contact Phone</label>
              <input
                type="text"
                value={alternatePhone}
                onChange={(e) => setAlternatePhone(e.target.value)}
                placeholder="7852091119"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="border-b border-slate-200/60 dark:border-zinc-800 pb-4 pt-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Delivery Address</h3>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House #45, MG Hospital Road, Sojati Gate"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Jodhpur"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Rajasthan"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="342001"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl text-xs font-extrabold transition shadow-xs flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
