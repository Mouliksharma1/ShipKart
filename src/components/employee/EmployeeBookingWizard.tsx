"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Copy, 
  Search, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package, 
  Truck, 
  CreditCard, 
  Save, 
  ArrowRight, 
  Loader2, 
  RotateCcw,
  Sparkles,
  FileText
} from "lucide-react";
import { ParcelType, PickupMethod, PaymentType, PaymentMode } from "@prisma/client";
import { calculatePriceAction as calculatePrice } from "@/app/actions/pricing";
import type { PricingBreakdown } from "@/lib/services/pricing";
import { 
  createEmployeeBookingAction, 
  getCustomerHistoryAction, 
  repeatBookingAction 
} from "@/app/actions/employee-booking";

interface EmployeeBookingWizardProps {
  offices: Array<{ id: string; name: string; city: string; state: string }>;
  defaultOriginId?: string;
}

interface ConsignmentItemRow {
  parcelType: ParcelType;
  quantity: number;
  weightKg: number;
  remarks: string;
  calculatedUnitPrice?: number;
  calculatedSubtotal?: number;
}

export function EmployeeBookingWizard({ offices, defaultOriginId }: EmployeeBookingWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const repeatLr = searchParams.get("repeatLr");

  // Form State
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  const [originOfficeId, setOriginOfficeId] = useState(defaultOriginId || offices[0]?.id || "");
  const [destinationOfficeId, setDestinationOfficeId] = useState(offices.find(o => o.id !== defaultOriginId)?.id || offices[1]?.id || "");

  const [pickupMethod, setPickupMethod] = useState<PickupMethod>(PickupMethod.SELF_DROP);
  const [pickupDistanceKm, setPickupDistanceKm] = useState<number>(3.0);

  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.PAID);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.CASH);
  const [specialNotes, setSpecialNotes] = useState("");

  const [items, setItems] = useState<ConsignmentItemRow[]>([
    { parcelType: ParcelType.BOX, quantity: 1, weightKg: 1.0, remarks: "" }
  ]);

  // UI State
  const [customerLookupResult, setCustomerLookupResult] = useState<any>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [pricingBreakdown, setPricingBreakdown] = useState<PricingBreakdown | null>(null);
  const [itemBreakdowns, setItemBreakdowns] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalPickupCharge, setTotalPickupCharge] = useState<number>(0);

  // Custom Price Override State
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<{ lrNumber: string; bookingId: string; totalAmount: number } | null>(null);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);

  const senderInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount for speed
  useEffect(() => {
    senderInputRef.current?.focus();
  }, []);

  // Repeat Booking clone loader
  useEffect(() => {
    if (repeatLr) {
      repeatBookingAction(repeatLr).then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setSenderName(d.senderName);
          setSenderPhone(d.senderPhone);
          setSenderEmail(d.senderEmail);
          setReceiverName(d.receiverName);
          setReceiverPhone(d.receiverPhone);
          setOriginOfficeId(d.originOfficeId);
          setDestinationOfficeId(d.destinationOfficeId);
          setPickupMethod(d.pickupMethod as PickupMethod);
          setPaymentType(d.paymentType as PaymentType);
          setPaymentMode(d.paymentMode as PaymentMode);
          setSpecialNotes(d.specialNotes);
          if (d.items && d.items.length > 0) {
            setItems(d.items.map((i: any) => ({
              parcelType: i.parcelType as ParcelType,
              quantity: i.quantity,
              weightKg: i.weightKg || 1.0,
              remarks: i.remarks || "",
            })));
          }
        }
      });
    }
  }, [repeatLr]);

  // Draft Auto-Save to localStorage
  useEffect(() => {
    const draftTimer = setInterval(() => {
      if (!repeatLr && (senderPhone || receiverPhone)) {
        const draft = {
          senderName, senderPhone, senderEmail, pickupAddress,
          receiverName, receiverPhone, originOfficeId, destinationOfficeId,
          pickupMethod, paymentType, paymentMode, specialNotes, items
        };
        localStorage.setItem("shipkart_counter_draft", JSON.stringify(draft));
        setDraftSavedTime(new Date().toLocaleTimeString());
      }
    }, 5000);
    return () => clearInterval(draftTimer);
  }, [repeatLr, senderName, senderPhone, senderEmail, pickupAddress, receiverName, receiverPhone, originOfficeId, destinationOfficeId, pickupMethod, paymentType, paymentMode, specialNotes, items]);

  // Handle Customer Phone Blur -> Instant Lookup
  const handleSenderPhoneBlur = async () => {
    if (senderPhone.length === 10) {
      setIsLookingUp(true);
      const res = await getCustomerHistoryAction(senderPhone);
      setIsLookingUp(false);
      if (res.success && res.data) {
        setCustomerLookupResult(res.data);
        if (res.data.user?.name && !senderName) {
          setSenderName(res.data.user.name);
        }
        if (res.data.user?.email && !senderEmail) {
          setSenderEmail(res.data.user.email);
        }
      }
    }
  };

  // Quick fill receiver from customer lookup
  const applySavedReceiver = (rec: { name: string; phone: string }) => {
    setReceiverName(rec.name);
    setReceiverPhone(rec.phone);
  };

  // Multi-item handlers
  const handleAddItem = () => {
    setItems([...items, { parcelType: ParcelType.BOX, quantity: 1, weightKg: 1.0, remarks: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleDuplicateItem = (index: number) => {
    const itemToDup = items[index];
    setItems([...items, { ...itemToDup }]);
  };

  const updateItem = (index: number, key: keyof ConsignmentItemRow, val: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: val };
    setItems(newItems);
  };

  // Real-time Pricing Calculation
  useEffect(() => {
    let isCancelled = false;

    async function recalculatePricing() {
      if (!originOfficeId || !destinationOfficeId || items.length === 0) return;
      if (originOfficeId === destinationOfficeId) {
        setErrorMsg("Origin Office and Destination Office cannot be the same.");
        return;
      }
      setErrorMsg("");
      setIsCalculating(true);

      let runningSubtotal = 0;
      let runningPickupCharge = 0;
      const computedBreakdowns: any[] = [];
      let totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

      for (const item of items) {
        const res = await calculatePrice({
          originOfficeId,
          destinationOfficeId,
          parcelType: item.parcelType,
          pickupMethod,
          quantity: item.quantity,
          pickupDistanceKm,
        });

        if (!isCancelled) {
          if (!res.success) {
            setErrorMsg(res.error || "Pricing calculation failed");
          } else {
            computedBreakdowns.push(res);
            runningSubtotal += res.subtotal || 0;
            runningPickupCharge += res.pickupCharge || 0;
          }
        }
      }

      if (!isCancelled) {
        setItemBreakdowns(computedBreakdowns);
        setTotalPrice(runningSubtotal);
        setTotalPickupCharge(runningPickupCharge);
        setPricingBreakdown(computedBreakdowns[0] || null);
        setIsCalculating(false);
      }
    }

    recalculatePricing();
    return () => { isCancelled = true; };
  }, [originOfficeId, destinationOfficeId, pickupMethod, pickupDistanceKm, items]);

  // Form Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (originOfficeId === destinationOfficeId) {
      setErrorMsg("Origin and Destination offices must be different.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const payload = {
      senderName,
      senderPhone,
      senderEmail: senderEmail || undefined,
      pickupAddress: pickupAddress || undefined,
      receiverName,
      receiverPhone,
      originOfficeId,
      destinationOfficeId,
      pickupMethod,
      pickupDistanceKm,
      paymentType,
      paymentMode,
      customOverridePrice: useCustomPrice && customPrice ? parseFloat(customPrice) : undefined,
      specialNotes: specialNotes || undefined,
      items: items.map(i => ({
        parcelType: i.parcelType,
        quantity: Number(i.quantity),
        weightKg: Number(i.weightKg),
        remarks: i.remarks || undefined,
      })),
    };

    const finalChargedTotal = useCustomPrice && customPrice ? (parseFloat(customPrice) || 0) : totalPrice;

    const res = await createEmployeeBookingAction(payload);
    setIsSubmitting(false);

    if (res.success && res.lrNumber && res.bookingId) {
      localStorage.removeItem("shipkart_counter_draft");
      setSuccessData({ lrNumber: res.lrNumber, bookingId: res.bookingId, totalAmount: finalChargedTotal });
    } else {
      setErrorMsg(res.error || "Failed to complete counter booking.");
    }
  };

  function useRouter() {
    return {
      push: (url: string) => { window.location.href = url; }
    };
  }

  // SUCCESS CONFIRMATION MODAL / SCREEN
  if (successData) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-2xl space-y-6 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
            COUNTER BOOKING COMPLETED
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            LR Generated Successfully!
          </h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
            Official Consignment Record has been saved in the system.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-4 text-left">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-neutral-800 pb-3">
            <span className="text-xs text-slate-500">Sequential LR Number:</span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400">{successData.lrNumber}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Sender:</span>
            <span className="font-bold text-slate-900 dark:text-white">{senderName} ({senderPhone})</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Receiver:</span>
            <span className="font-bold text-slate-900 dark:text-white">{receiverName} ({receiverPhone})</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Total Amount ({paymentType}):</span>
            <span className="font-extrabold text-slate-900 dark:text-white">₹{successData.totalAmount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => {
              setSuccessData(null);
              setSenderName("");
              setSenderPhone("");
              setSenderEmail("");
              setReceiverName("");
              setReceiverPhone("");
              setItems([{ parcelType: ParcelType.BOX, quantity: 1, weightKg: 1.0, remarks: "" }]);
              setCustomerLookupResult(null);
            }}
            className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-amber-950 text-xs shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Booking</span>
          </button>

          <Link
            href={`/lr/${successData.bookingId}`}
            target="_blank"
            className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Digital LR (View/Print)</span>
          </Link>

          <Link
            href={`/employee/bookings/${successData.lrNumber}`}
            className="py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center space-x-2"
          >
            <span>Full Details & History</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitBooking} className="space-y-8 max-w-6xl mx-auto">
      {/* HEADER & DRAFT INDICATOR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Employee Counter Booking Form
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Fast entry interface optimized for sub-30 second bookings.
          </p>
        </div>

        {repeatLr ? (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
            <RotateCcw className="h-4 w-4" />
            <span>Cloning Previous LR: {repeatLr}</span>
          </span>
        ) : draftSavedTime && (
          <span className="text-[11px] text-slate-400 flex items-center space-x-1 bg-slate-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
            <Save className="h-3 w-3 text-emerald-500" />
            <span>Auto-saved draft at {draftSavedTime}</span>
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: FORM INPUTS */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: SENDER INFORMATION */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <User className="h-4 w-4 text-amber-500" />
                <span>1. Sender Details</span>
              </h2>
              {isLookingUp && <span className="text-xs text-amber-500 flex items-center"><Loader2 className="h-3 w-3 animate-spin mr-1" /> Searching customer database...</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  ref={senderInputRef}
                  type="text"
                  required
                  maxLength={10}
                  placeholder="10-digit phone number"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value.replace(/\D/g, ""))}
                  onBlur={handleSenderPhoneBlur}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-semibold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Sender Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-semibold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="sender@example.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Pickup Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Street / Area / City"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* CUSTOMER LOOKUP RESULTS & QUICK FILL */}
            {customerLookupResult && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Existing Customer Found: {customerLookupResult.user?.name || "Customer"}</span>
                  </span>
                  <span>{customerLookupResult.previousBookings?.length || 0} Previous Bookings</span>
                </div>

                {customerLookupResult.savedReceivers?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
                      Quick Select Saved Receiver:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {customerLookupResult.savedReceivers.map((rec: any) => (
                        <button
                          key={rec.id}
                          type="button"
                          onClick={() => applySavedReceiver(rec)}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] font-bold text-slate-800 dark:text-neutral-200 hover:border-amber-500 transition-colors"
                        >
                          + {rec.name} ({rec.phone})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 2: RECEIVER INFORMATION */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-neutral-800 pb-3">
              <User className="h-4 w-4 text-blue-500" />
              <span>2. Receiver Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Receiver Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-semibold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Receiver Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="10-digit phone number"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-semibold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ROUTE & PICKUP METHOD */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-neutral-800 pb-3">
              <Truck className="h-4 w-4 text-emerald-500" />
              <span>3. Route & Pickup Options</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Origin Office *
                </label>
                <select
                  value={originOfficeId}
                  onChange={(e) => setOriginOfficeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-bold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                >
                  {offices.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Destination Office *
                </label>
                <select
                  value={destinationOfficeId}
                  onChange={(e) => setDestinationOfficeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-bold text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                >
                  {offices.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Pickup Method
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setPickupMethod(PickupMethod.SELF_DROP)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      pickupMethod === PickupMethod.SELF_DROP
                        ? "bg-amber-500 border-amber-500 text-amber-950 shadow-sm"
                        : "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300"
                    }`}
                  >
                    Self Drop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupMethod(PickupMethod.TAXI_PICKUP)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      pickupMethod === PickupMethod.TAXI_PICKUP
                        ? "bg-amber-500 border-amber-500 text-amber-950 shadow-sm"
                        : "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300"
                    }`}
                  >
                    Taxi Pickup
                  </button>
                </div>
              </div>

              {pickupMethod === PickupMethod.TAXI_PICKUP && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Pickup Distance (KM)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pickupDistanceKm}
                    onChange={(e) => setPickupDistanceKm(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                    Rule: Max 5 KM & Min 5 items. (Envelope not allowed)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: PARCEL ITEMS */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Package className="h-4 w-4 text-purple-500" />
                <span>4. Consignment Items ({items.length})</span>
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500 hover:text-amber-950 transition-colors flex items-center space-x-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                      Item #{idx + 1}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDuplicateItem(idx)}
                        title="Duplicate Item"
                        className="p-1 rounded text-slate-400 hover:text-amber-500"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          title="Remove Item"
                          className="p-1 rounded text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
                        Parcel Type
                      </label>
                      <select
                        value={item.parcelType}
                        onChange={(e) => updateItem(idx, "parcelType", e.target.value as ParcelType)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold text-slate-900 dark:text-white"
                      >
                        <option value={ParcelType.ENVELOPE}>ENVELOPE</option>
                        <option value={ParcelType.BOX}>BOX</option>
                        <option value={ParcelType.MEDIUM_PARCEL}>MEDIUM PARCEL</option>
                        <option value={ParcelType.LARGE_BUNDLE}>LARGE BUNDLE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
                        Weight (KG)
                      </label>
                      <input
                        type="number"
                        step="any"
                        min={0.1}
                        value={item.weightKg}
                        onChange={(e) => updateItem(idx, "weightKg", parseFloat(e.target.value) || 1.0)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
                        Remarks
                      </label>
                      <input
                        type="text"
                        placeholder="Fragile, Handle with care"
                        value={item.remarks}
                        onChange={(e) => updateItem(idx, "remarks", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME SUMMARY & PAYMENT */}
        <div className="lg:col-span-4 space-y-6">
          {/* PRICE BREAKDOWN CARD */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-neutral-800 pb-3">
              <Calculator className="h-4 w-4 text-amber-500" />
              <span>Real-Time Price Calculation</span>
            </h2>

            {isCalculating ? (
              <div className="py-6 text-center text-xs text-amber-500 flex justify-center items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Calculating tariff rates...
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {itemBreakdowns.map((bd, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-neutral-800">
                    <span className="text-slate-600 dark:text-neutral-400">
                      Item #{i+1} ({bd.parcelType} x{bd.quantity})
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{bd.subtotal}</span>
                  </div>
                ))}

                {pickupMethod === PickupMethod.TAXI_PICKUP && (
                  <div className="flex justify-between items-center py-1 text-amber-600 dark:text-amber-400">
                    <span>Total Pickup Surcharge</span>
                    <span className="font-bold">₹{totalPickupCharge}</span>
                  </div>
                )}

                {/* CUSTOM PRICE OVERRIDE CONTROL */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-neutral-300">
                      Custom Counter Price
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomPrice(!useCustomPrice);
                        if (!useCustomPrice) setCustomPrice(totalPrice.toString());
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                        useCustomPrice
                          ? "bg-amber-500 text-amber-950"
                          : "bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400"
                      }`}
                    >
                      {useCustomPrice ? "Custom Active" : "Enable Custom"}
                    </button>
                  </div>

                  {useCustomPrice ? (
                    <div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-amber-500 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          min={0}
                          value={customPrice}
                          onChange={(e) => setCustomPrice(e.target.value)}
                          placeholder="Enter custom amount"
                          className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-amber-500/50 bg-white dark:bg-neutral-900 text-xs font-black text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                        * Override system tariff with custom counter rate.
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      Standard auto-calculated tariff applied. Click to override manually.
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-neutral-800 flex justify-between items-center">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">Grand Total:</span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    ₹{useCustomPrice && customPrice ? parseFloat(customPrice) || 0 : totalPrice}
                  </span>
                </div>

                {pricingBreakdown?.resolutionStage && (
                  <p className="text-[10px] text-slate-400 text-right">
                    Tariff Tier: {pricingBreakdown.resolutionStage}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* PAYMENT METHOD MODULE */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-neutral-800 pb-3">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              <span>Payment Module</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Payment Type
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType(PaymentType.PAID)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      paymentType === PaymentType.PAID
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300"
                    }`}
                  >
                    PAID (Immediate)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType(PaymentType.TO_PAY)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      paymentType === PaymentType.TO_PAY
                        ? "bg-amber-500 border-amber-500 text-amber-950"
                        : "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300"
                    }`}
                  >
                    TO PAY (Destination)
                  </button>
                </div>
              </div>

              {paymentType === PaymentType.PAID && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Payment Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode(PaymentMode.CASH)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        paymentMode === PaymentMode.CASH
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900"
                          : "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300"
                      }`}
                    >
                      CASH
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode(PaymentMode.UPI)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        paymentMode === PaymentMode.UPI
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900"
                          : "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300"
                      }`}
                    >
                      UPI
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Special Instructions / Notes
                </label>
                <input
                  type="text"
                  placeholder="Counter notes or customer instructions"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isCalculating}
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 font-extrabold text-amber-950 text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating LR Number...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Generate LR & Complete Booking</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
