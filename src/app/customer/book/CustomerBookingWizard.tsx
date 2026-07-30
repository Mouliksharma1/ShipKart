"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction } from "@/app/actions/booking";
import { calculatePriceAction } from "@/app/actions/pricing";
import { ParcelType, PickupMethod, PaymentType, PaymentMode } from "@prisma/client";
import {
  MapPin,
  User,
  Phone,
  Mail,
  Box,
  Plus,
  Trash2,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Info,
  Shield,
  QrCode,
  Download,
  Share2,
} from "lucide-react";

interface OfficeOption {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface ParcelItemState {
  id: string;
  parcelType: ParcelType;
  quantity: number;
  weightKg: number;
  photoUrl?: string;
  remarks?: string;
  previewUrl?: string;
}

export default function CustomerBookingWizard({ offices }: { offices: OfficeOption[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<{ lrNumber: string; id: string } | null>(null);

  // Default Offices (Jodhpur HO & First Branch)
  const headOffice = offices.find(o => o.name.includes("Head Office") || o.city === "Jodhpur") || offices[0];
  const firstBranch = offices.find(o => o.id !== headOffice?.id) || offices[1] || offices[0];

  // STEP 1: SENDER FORM STATE
  const [senderName, setSenderName] = useState("Rudra Pratap");
  const [senderPhone, setSenderPhone] = useState("9829012345");
  const [senderEmail, setSenderEmail] = useState("rudra@shipkart.com");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [pickupAddress, setPickupAddress] = useState("Paota Circle, Jodhpur, Rajasthan");
  const [gpsStatus, setGpsStatus] = useState<"IDLE" | "CAPTURING" | "CAPTURED" | "DENIED">("IDLE");

  // STEP 2: RECEIVER FORM STATE
  const [receiverName, setReceiverName] = useState("Vikram Sharma");
  const [receiverPhone, setReceiverPhone] = useState("9414098765");

  // STEP 3: PARCEL ITEMS STATE (Multi-Item)
  const [items, setItems] = useState<ParcelItemState[]>([
    { id: "1", parcelType: ParcelType.BOX, quantity: 5, weightKg: 2.5, photoUrl: "", remarks: "Fragile Electronics" },
  ]);

  // STEP 4: ROUTE & PICKUP STATE
  const [originOfficeId, setOriginOfficeId] = useState(headOffice?.id || "");
  const [destinationOfficeId, setDestinationOfficeId] = useState(firstBranch?.id || "");
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>(PickupMethod.SELF_DROP);
  const [pickupDistanceKm, setPickupDistanceKm] = useState(3.0);

  // STEP 5: PAYMENT STATE
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.PAID);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.CASH);
  const [specialNotes, setSpecialNotes] = useState("");

  // DYNAMIC PRICE SUMMARY CALCULATIONS
  const [priceBreakdowns, setPriceBreakdowns] = useState<any[]>([]);
  const [totalSubtotal, setTotalSubtotal] = useState(0);
  const [totalPickupCharge, setTotalPickupCharge] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [taxiWarning, setTaxiWarning] = useState<string | null>(null);
  const [taxiEligible, setTaxiEligible] = useState(true);

  // GPS Capture Handler
  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus("DENIED");
      return;
    }
    setGpsStatus("CAPTURING");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationAccuracy(pos.coords.accuracy);
        setGpsStatus("CAPTURED");
      },
      (err) => {
        console.warn("GPS Permission Denied:", err);
        setGpsStatus("DENIED");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Parcel Item Handlers
  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), parcelType: ParcelType.MEDIUM_PARCEL, quantity: 1, weightKg: 1.0, photoUrl: "", remarks: "" },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const handleUpdateItem = (id: string, field: keyof ParcelItemState, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  // Recalculate Prices on Step Changes & Form Edits
  useEffect(() => {
    async function calculateAll() {
      let sub = 0;
      let pickup = 0;
      let isEligible = true;
      let warningMsg: string | null = null;
      const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

      const breakdowns = [];
      for (const item of items) {
        const res = await calculatePriceAction({
          originOfficeId,
          destinationOfficeId,
          parcelType: item.parcelType,
          pickupMethod,
          quantity: item.quantity,
          pickupDistanceKm,
        });

        if (res.success) {
          sub += res.subtotal || 0;
          pickup += res.pickupCharge || 0;
          breakdowns.push({ ...res, itemQuantity: item.quantity, itemType: item.parcelType });
        }

        if (pickupMethod === PickupMethod.TAXI_PICKUP) {
          if (item.parcelType === ParcelType.ENVELOPE) {
            isEligible = false;
            warningMsg = "Taxi Pickup is not allowed for Envelope items.";
          } else if (totalQty < 5) {
            isEligible = false;
            warningMsg = `Taxi pickup requires minimum 5 items total (Current: ${totalQty}).`;
          } else if (pickupDistanceKm > 5) {
            isEligible = false;
            warningMsg = `Customer pickup distance (${pickupDistanceKm} KM) exceeds 5 KM limit.`;
          }
        }
      }

      setPriceBreakdowns(breakdowns);
      setTotalSubtotal(sub);
      setTotalPickupCharge(pickup);
      setGrandTotal(sub);
      setTaxiEligible(isEligible);
      setTaxiWarning(warningMsg);
    }

    if (originOfficeId && destinationOfficeId && items.length > 0) {
      calculateAll();
    }
  }, [originOfficeId, destinationOfficeId, items, pickupMethod, pickupDistanceKm]);

  // Submit Final Booking
  const handleFinalSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      senderName,
      senderPhone,
      senderEmail,
      latitude,
      longitude,
      locationAccuracy,
      pickupAddress,
      receiverName,
      receiverPhone,
      originOfficeId,
      destinationOfficeId,
      pickupMethod,
      pickupDistanceKm,
      paymentType,
      paymentMode,
      specialNotes,
      items: items.map((i) => ({
        parcelType: i.parcelType,
        quantity: Number(i.quantity),
        weightKg: Number(i.weightKg),
        photoUrl: i.photoUrl,
        remarks: i.remarks,
      })),
    };

    const res = await createBookingAction(payload);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Failed to confirm booking.");
    } else {
      setSuccessBooking({ lrNumber: res.lrNumber!, id: res.bookingId! });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-neutral-800 pb-5 text-center">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2">
          <Shield className="h-3.5 w-3.5" />
          <span>CUSTOMER ONLINE BOOKING ENGINE</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Book Consignment Parcel</h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
          Pooja Travels & Cargo Express Logistics Wizard (Multi-Item Support & Global LR Generation)
        </p>
      </div>

      {/* SUCCESS CONFIRMATION MODAL OVERLAY */}
      {successBooking ? (
        <div className="rounded-3xl border border-green-500/30 bg-gradient-to-b from-green-500/10 via-neutral-900 to-neutral-950 p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/40">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Consignment Booked Successfully!</h2>
            <p className="text-xs text-neutral-400">Your consignment has been registered with atomic global LR sequence.</p>
          </div>

          {/* LR Badge Card */}
          <div className="max-w-md mx-auto rounded-2xl border border-amber-500/40 bg-black/60 p-6 space-y-3">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">GLOBAL LR NUMBER</span>
            <div className="text-3xl font-black text-white font-mono tracking-wider">{successBooking.lrNumber}</div>
            <div className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
              STATUS: BOOKED
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-bold">
            <button
              onClick={() => router.push(`/lr/${successBooking.id}`)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>View & Download Digital LR</span>
            </button>
            <button
              onClick={() => router.push(`/customer/booking/${successBooking.lrNumber}`)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500 text-amber-950 hover:bg-amber-400 shadow-md transition-colors"
            >
              <QrCode className="h-4 w-4" />
              <span>Booking Receipt & QR</span>
            </button>
            <button
              onClick={() => router.push("/customer/history")}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
            >
              <Truck className="h-4 w-4" />
              <span>Track Booking</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Book Another Parcel</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* STEP PROGRESS INDICATOR */}
          <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold">
            {["1. Sender", "2. Receiver", "3. Items", "4. Route", "5. Payment", "6. Confirm"].map((label, idx) => (
              <div
                key={label}
                className={`py-2 rounded-xl border transition-all ${
                  step === idx + 1
                    ? "bg-amber-500 text-amber-950 border-amber-400 shadow-md font-black"
                    : step > idx + 1
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-slate-100 dark:bg-neutral-900 text-slate-400 dark:text-neutral-600 border-transparent"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-bold flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: SENDER INFORMATION */}
          {step === 1 && (
            <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-sm border-b pb-3 border-slate-200 dark:border-neutral-800">
                <User className="h-4 w-4 text-amber-500" />
                <span>Step 1: Sender Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Sender Full Name *</label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Sender Phone Number (10 Digits) *</label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Sender Email (Optional)</label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              {/* GPS Location Capture (Optional Fallback) */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-white">Live GPS Location (Optional)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCaptureGPS}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-amber-950 font-bold hover:bg-amber-400 transition-colors"
                  >
                    {gpsStatus === "CAPTURING" ? "Capturing..." : "Capture GPS Location"}
                  </button>
                </div>

                {latitude && longitude ? (
                  <p className="text-[11px] text-green-600 dark:text-green-400 font-mono font-semibold">
                    ✓ GPS Coordinates Captured: {latitude.toFixed(5)}, {longitude.toFixed(5)} (Accuracy: {locationAccuracy?.toFixed(1)}m)
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                    If permission is denied, manual address fallback is automatically enabled.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Manual Pickup Address</label>
                <textarea
                  rows={2}
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Enter house/shop address for pickup"
                  className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-amber-950 font-bold hover:bg-amber-400 flex items-center space-x-2"
                >
                  <span>Next: Receiver Information</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: RECEIVER INFORMATION */}
          {step === 2 && (
            <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-sm border-b pb-3 border-slate-200 dark:border-neutral-800">
                <User className="h-4 w-4 text-amber-500" />
                <span>Step 2: Receiver Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Receiver Full Name *</label>
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Receiver Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-amber-950 font-bold hover:bg-amber-400 flex items-center space-x-2"
                >
                  <span>Next: Parcel Items</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PARCEL ITEMS (MULTI-ITEM BUILDER) */}
          {step === 3 && (
            <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-neutral-800">
                <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Box className="h-4 w-4 text-amber-500" />
                  <span>Step 3: Parcel Items (Multi-Item Support)</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 space-y-3">
                    <div className="flex items-center justify-between font-bold border-b border-slate-200 dark:border-neutral-800 pb-2">
                      <span>Parcel Item #{idx + 1}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Parcel Type *</label>
                        <select
                          value={item.parcelType}
                          onChange={(e) => handleUpdateItem(item.id, "parcelType", e.target.value as ParcelType)}
                          className="w-full rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2 font-bold"
                        >
                          <option value="ENVELOPE">ENVELOPE</option>
                          <option value="BOX">BOX</option>
                          <option value="MEDIUM_PARCEL">MEDIUM PARCEL</option>
                          <option value="LARGE_BUNDLE">LARGE BUNDLE</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Quantity *</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, "quantity", Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Approx Weight (KG)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.1"
                          value={item.weightKg}
                          onChange={(e) => handleUpdateItem(item.id, "weightKg", Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Parcel Photo URL (Optional)</label>
                        <input
                          type="url"
                          value={item.photoUrl}
                          onChange={(e) => handleUpdateItem(item.id, "photoUrl", e.target.value)}
                          placeholder="https://..."
                          className="w-full rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2 text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Remarks (Optional)</label>
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => handleUpdateItem(item.id, "remarks", e.target.value)}
                          placeholder="e.g. Fragile, Keep Dry"
                          className="w-full rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-2 text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-amber-950 font-bold hover:bg-amber-400 flex items-center space-x-2"
                >
                  <span>Next: Route & Pickup</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ROUTE & PICKUP METHOD */}
          {step === 4 && (
            <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-sm border-b pb-3 border-slate-200 dark:border-neutral-800">
                <Truck className="h-4 w-4 text-amber-500" />
                <span>Step 4: Transport Route & Pickup Method</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Origin Office *</label>
                  <select
                    value={originOfficeId}
                    onChange={(e) => setOriginOfficeId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white font-bold"
                  >
                    {offices.map((o) => (
                      <option key={o.id} value={o.id}>{o.name} ({o.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Destination Office *</label>
                  <select
                    value={destinationOfficeId}
                    onChange={(e) => setDestinationOfficeId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white font-bold"
                  >
                    {offices.map((o) => (
                      <option key={o.id} value={o.id}>{o.name} ({o.city})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pickup Method Selection */}
              <div className="space-y-3 pt-2">
                <label className="block font-bold text-slate-900 dark:text-white">Select Pickup Method</label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    onClick={() => setPickupMethod(PickupMethod.SELF_DROP)}
                    className={`p-4 rounded-xl border cursor-pointer flex items-center space-x-3 transition-all ${
                      pickupMethod === PickupMethod.SELF_DROP
                        ? "border-amber-500 bg-amber-500/10 font-bold"
                        : "border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950"
                    }`}
                  >
                    <input type="radio" checked={pickupMethod === PickupMethod.SELF_DROP} readOnly />
                    <div>
                      <span className="block font-bold text-slate-900 dark:text-white">Self Drop</span>
                      <span className="text-[11px] text-slate-500 dark:text-neutral-400">Customer drops parcel at Origin Office</span>
                    </div>
                  </label>

                  <label
                    onClick={() => {
                      if (taxiEligible) setPickupMethod(PickupMethod.TAXI_PICKUP);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer flex items-center space-x-3 transition-all ${
                      !taxiEligible
                        ? "opacity-50 cursor-not-allowed border-red-500/30 bg-red-500/5"
                        : pickupMethod === PickupMethod.TAXI_PICKUP
                        ? "border-amber-500 bg-amber-500/10 font-bold"
                        : "border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950"
                    }`}
                  >
                    <input type="radio" checked={pickupMethod === PickupMethod.TAXI_PICKUP} disabled={!taxiEligible} readOnly />
                    <div>
                      <span className="block font-bold text-slate-900 dark:text-white">Taxi Pickup</span>
                      <span className="text-[11px] text-slate-500 dark:text-neutral-400">Taxi collects parcel from sender location</span>
                    </div>
                  </label>
                </div>

                {!taxiEligible && taxiWarning && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center space-x-2">
                    <Info className="h-4 w-4 shrink-0" />
                    <span>{taxiWarning}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-amber-950 font-bold hover:bg-amber-400 flex items-center space-x-2"
                >
                  <span>Next: Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: PAYMENT SELECTION */}
          {step === 5 && (
            <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-sm border-b pb-3 border-slate-200 dark:border-neutral-800">
                <CreditCard className="h-4 w-4 text-amber-500" />
                <span>Step 5: Payment Options</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Payment Type *</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="PAID">PAID (Sender pays at booking)</option>
                    <option value="TO_PAY">TO PAY (Receiver pays at delivery)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Payment Mode *</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                    className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="CASH">Cash to Driver / Counter</option>
                    <option value="UPI">UPI / Digital QR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-neutral-300 mb-1">Special Handling Notes (Optional)</label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. Call receiver before arrival"
                  className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-amber-950 font-bold hover:bg-amber-400 flex items-center space-x-2"
                >
                  <span>Next: Review & Confirm</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & CONFIRM BOOKING */}
          {step === 6 && (
            <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-6 shadow-xl text-xs">
              <div className="flex items-center space-x-2 font-bold text-slate-900 dark:text-white text-sm border-b pb-3 border-slate-200 dark:border-neutral-800">
                <Shield className="h-4 w-4 text-amber-500" />
                <span>Step 6: Review & Confirm Consignment</span>
              </div>

              {/* Review Details Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 space-y-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[10px]">SENDER</span>
                  <p className="font-bold text-slate-900 dark:text-white">{senderName}</p>
                  <p className="text-slate-500">{senderPhone}</p>
                  <p className="text-slate-400">{pickupAddress}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 space-y-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[10px]">RECEIVER</span>
                  <p className="font-bold text-slate-900 dark:text-white">{receiverName}</p>
                  <p className="text-slate-500">{receiverPhone}</p>
                </div>
              </div>

              {/* Itemized Pricing Breakdown Table */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white">Itemized Price Breakdown</span>

                <div className="rounded-xl border border-slate-200 dark:border-neutral-800 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-neutral-950 font-bold border-b border-slate-200 dark:border-neutral-800">
                      <tr>
                        <th className="p-2.5">Parcel Item</th>
                        <th className="p-2.5">Qty</th>
                        <th className="p-2.5">Unit Rate</th>
                        <th className="p-2.5">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-neutral-800">
                      {priceBreakdowns.map((pb, i) => (
                        <tr key={i}>
                          <td className="p-2.5 font-bold">{pb.itemType}</td>
                          <td className="p-2.5">{pb.itemQuantity}</td>
                          <td className="p-2.5 font-mono">₹{pb.unitPrice}</td>
                          <td className="p-2.5 font-mono font-bold">₹{pb.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-sm font-bold">
                  <span>Grand Total Amount</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white font-mono">₹{grandTotal}</span>
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-bold flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFinalSubmit}
                  className="px-6 py-3 rounded-xl bg-amber-500 text-amber-950 font-black shadow-lg hover:bg-amber-400 transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <span>Confirming Booking...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Confirm & Book Consignment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
