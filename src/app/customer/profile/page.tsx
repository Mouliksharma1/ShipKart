'use client';

import React, { useEffect, useState } from 'react';
import { getProfileAction, updateProfileAction } from '@/app/actions/customer';
import { User, Phone, Mail, MapPin, Save, ArrowLeft, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function getCookie(name: string) {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}

export default function CustomerProfilePage() {
  const [phone, setPhone] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');

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
      const pic = (u as any).photo || (u as any).profilePhoto || (u as any).avatarUrl;
      if (pic) {
        setAvatarUrl(pic);
        setAvatarPreview(pic);
        localStorage.setItem(`shipkart_avatar_${searchPhone}`, pic);
      }
    } else {
      setPhone(searchPhone);
      setInputPhone(searchPhone);
    }
    setLoading(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 250;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarPreview(compressedBase64);
          setAvatarUrl(compressedBase64);
          if (phone) {
            localStorage.setItem(`shipkart_avatar_${phone}`, compressedBase64);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryPhone = urlParams.get('phone') || urlParams.get('mobile');
      const storedPhone = localStorage.getItem('shipkart_customer_phone') || getCookie('shipkart_customer_phone');
      
      const activePhone = queryPhone || storedPhone || '6378507160';
      setPhone(activePhone);
      setInputPhone(activePhone);
      const cachedAvatar = localStorage.getItem(`shipkart_avatar_${activePhone}`);
      if (cachedAvatar) {
        setAvatarPreview(cachedAvatar);
        setAvatarUrl(cachedAvatar);
      }
      fetchProfile(activePhone);
    }
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
    if (avatarUrl) {
      localStorage.setItem(`shipkart_avatar_${phone}`, avatarUrl);
    }
    const res = await updateProfileAction(phone, {
      name,
      phone,
      email,
      alternatePhone,
      address,
      city,
      state,
      pincode,
      avatarUrl
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
            <CheckCircle2 className="w-4 h-4 mr-2" /> Profile picture & information updated & saved!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Picture Upload Section */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
            <div className="relative group">
              <div className="p-1 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md">
                <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center border-4 border-white dark:border-neutral-900 overflow-hidden relative">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile Picture" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400 stroke-[1.8]" />
                  )}
                </div>
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-amber-500 text-amber-950 hover:bg-amber-400 rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95 border-2 border-white dark:border-neutral-900"
                title="Upload Profile Picture"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Profile Photo</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Upload your avatar picture (PNG, JPG, WebP). Displays with your Instagram-style ring badge across ShipKart.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <label
                  htmlFor="avatar-upload"
                  className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-xl cursor-pointer transition inline-flex items-center"
                >
                  Choose Image File
                </label>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPreview('');
                      setAvatarUrl('');
                      localStorage.removeItem(`shipkart_avatar_${phone}`);
                    }}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl transition"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

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
