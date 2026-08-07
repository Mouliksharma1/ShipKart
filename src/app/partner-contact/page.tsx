"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageSquare,
  MapPin,
  Building2,
  Send,
  CheckCircle2,
  User,
  Map,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Headphones
} from "lucide-react";

export default function PartnerContactPage() {
  const [formData, setFormData] = useState({
    firmOrName: "",
    contactNumber: "",
    location: "",
    topic: "Cargo Route Collaboration",
    description: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const whatsappMessage = encodeURIComponent(
    `*ShipKart Partner Collaboration Inquiry*\n\n` +
    `*Firm/Name:* ${formData.firmOrName}\n` +
    `*Contact Number:* ${formData.contactNumber}\n` +
    `*Location:* ${formData.location}\n` +
    `*Topic:* ${formData.topic}\n` +
    `*Description:* ${formData.description}`
  );

  const whatsappUrl = `https://wa.me/917852091119?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 transition-colors duration-300">
      {/* HERO BANNER */}
      <section className="relative py-16 lg:py-20 bg-slate-900 dark:bg-neutral-950 text-white border-b border-slate-800 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full bg-amber-500 text-amber-950 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
            <Sparkles className="h-4 w-4" />
            <span>BECOME A SHIPKART FAMILY PARTNER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Collaborate With <span className="text-amber-400">ShipKart</span> in Rajasthan
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            If you own a bus cargo service, branch office, or logistics network in Rajasthan, partner with us to expand your reach and join our fast-growing statewide bus freight network.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <section className="py-12 lg:py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT SIDE: DIRECT CONTACT & MAP */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Quick Contact Cards */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Headphones className="w-5 h-5 text-amber-500" />
                <span>Direct Contact Channels</span>
              </h2>

              {/* Phone Card */}
              <a
                href="tel:7852091119"
                className="flex items-center space-x-4 p-5 rounded-2xl border-2 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-amber-500 dark:hover:border-amber-500 transition-all shadow-sm group"
              >
                <div className="p-3.5 rounded-xl bg-amber-500 text-amber-950 font-black shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6 fill-amber-950" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-slate-400 block">Helpline Number</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    +91 7852091119
                  </span>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 font-medium">Click to call directly</p>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/917852091119?text=Hello%20ShipKart%20Team,%20I%20own%20a%20cargo%20service%20in%20Rajasthan%20and%20want%20to%20collaborate."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/20 hover:border-emerald-500 transition-all shadow-sm group"
              >
                <div className="p-3.5 rounded-xl bg-emerald-500 text-white font-black shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 block">WhatsApp Chat</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    +91 7852091119
                  </span>
                  <p className="text-xs text-slate-600 dark:text-neutral-300 mt-0.5 font-semibold">Instant WhatsApp Inquiry & Discussion</p>
                </div>
              </a>
            </div>

            {/* Google Map & Head Office Location */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Google Map Location</span>
              </h2>

              <div className="rounded-3xl border-2 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 shadow-md space-y-4">
                <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800">
                  <iframe
                    title="ShipKart Rajasthan Head Office Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.882885918731!2d75.787268!3d26.912433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db3856b3e34b9%3A0xb36b56b3b5b36b!2sStation%20Road%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-neutral-300 font-medium">
                  <div className="flex items-start space-x-2">
                    <Building2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">Pooja Travels & Cargo (Head Office)</strong>
                      Station Road, Commercial Bus Cargo Terminal, Jaipur, Rajasthan - 302001
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold pt-1">
                    <Map className="w-4 h-4 shrink-0" />
                    <a
                      href="https://maps.google.com/?q=Station+Road+Jaipur+Rajasthan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center space-x-1"
                    >
                      <span>Open Directions on Google Maps</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: PARTNER CONTACT FORM */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border-2 border-amber-500/40 bg-white dark:bg-neutral-900 p-6 sm:p-10 shadow-xl space-y-6">
              <div>
                <span className="px-3 py-1 rounded-md bg-amber-500 text-amber-950 text-xs font-black uppercase tracking-wider">
                  Partner Contact Form
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">
                  Submit Your Collaboration Request
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 mt-1 font-medium">
                  Fill out the form below. All fields are <span className="text-red-500 font-bold">*required</span>.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Form Submitted Successfully!</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 font-medium max-w-md mx-auto">
                      Thank you <strong className="text-emerald-600 dark:text-emerald-400">{formData.firmOrName}</strong>! Our partnership team will contact you at <strong className="text-slate-900 dark:text-white">{formData.contactNumber}</strong> shortly.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 text-xs font-black shadow-md transition-all"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>Send Form Details on WhatsApp (+91 7852091119)</span>
                    </a>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full sm:w-auto text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white underline px-4 py-2"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Field 1: Firm Name / Your Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-700 dark:text-neutral-300 flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      <span>Firm Name / Your Name <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Logistics / Rahul Sharma"
                      value={formData.firmOrName}
                      onChange={(e) => setFormData({ ...formData, firmOrName: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field 2: Contact Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-700 dark:text-neutral-300 flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-500" />
                      <span>Contact Number <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 7852091119"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field 3: Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-700 dark:text-neutral-300 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span>Location <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jodhpur / Kota / Bikaner, Rajasthan"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Field 4: Topic */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-700 dark:text-neutral-300 flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-500" />
                      <span>Topic <span className="text-red-500">*</span></span>
                    </label>
                    <select
                      required
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                    >
                      <option value="Cargo Route Collaboration">Cargo Route Collaboration</option>
                      <option value="Branch Office Franchise">Branch Office Franchise</option>
                      <option value="Bus Fleet Attachment">Bus Fleet Attachment</option>
                      <option value="Rates & Commission Inquiry">Rates & Commission Inquiry</option>
                      <option value="Other Partnership Inquiry">Other Partnership Inquiry</option>
                    </select>
                  </div>

                  {/* Field 5: Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase text-slate-700 dark:text-neutral-300 flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-500" />
                      <span>Description <span className="text-red-500">*</span></span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please describe your cargo services, daily bus routes, office capacity, or collaboration details..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 px-8 py-4 text-sm font-black shadow-md hover:shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Contact Request</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
