"use client";

import React from "react";

export type LRTemplateProps = {
  booking: {
    id: string;
    lrNumber: string;
    senderName: string;
    senderPhone: string;
    senderEmail?: string | null;
    receiverName: string;
    receiverPhone: string;
    originOffice: {
      name: string;
      city: string;
      address: string;
      phone: string;
    };
    destinationOffice: {
      name: string;
      city: string;
      address: string;
      phone: string;
    };
    pickupMethod: string;
    pickupAddress?: string | null;
    paymentType: string;
    paymentMode: string;
    paymentStatus: boolean;
    subtotalAmount: number;
    totalPickupCharge: number;
    totalAmount: number;
    specialNotes?: string | null;
    status: string;
    createdAt: string | Date;
    items: Array<{
      id?: string;
      parcelType: string;
      quantity: number;
      weightKg?: number | null;
      remarks?: string | null;
      unitPrice?: number;
      subtotal?: number;
      itemPickupCharge?: number;
    }>;
  };
  companySettings?: {
    companyName?: string;
    tagline?: string;
    helpline1?: string;
    helpline2?: string;
    helpline3?: string;
    address?: string;
    terms?: string;
  } | null;
  qrCodeDataUrl?: string | null;
  printableRef?: React.RefObject<HTMLDivElement | null>;
};

export const LRTemplate: React.FC<LRTemplateProps> = ({
  booking,
  companySettings,
  qrCodeDataUrl,
  printableRef,
}) => {
  const formattedDate = new Date(booking.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const printTimestamp = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const helpline1 = companySettings?.helpline1 || "6350603414";
  const helpline2 = companySettings?.helpline2 || "7852091119";
  const helpline3 = companySettings?.helpline3 || "0291-2651955";
  const headOfficeAddress =
    companySettings?.address ||
    "45, Jaswant Building, MG Hospital Rd, Sojati Gate, Rawaton Ka Bass, Jodhpur, Rajasthan 342001";

  return (
    <div
      ref={printableRef}
      className="lr-document-container max-w-4xl mx-auto bg-white text-slate-900 font-sans p-6 md:p-8 border border-slate-300 rounded-lg shadow-sm print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full"
      style={{ colorScheme: "light" }}
    >
      {/* 1. DOCUMENT HEADER */}
      <div className="border-b-2 border-blue-900 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Company Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xl shadow-inner print:bg-blue-900 print:text-white">
              SK
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-blue-950 uppercase">
                {companySettings?.companyName || "POOJA TRAVELS & CARGO"}
              </h1>
              <p className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
                ShipKart Digital Lorry Receipt (Builty)
              </p>
            </div>
          </div>

          {/* LR Number & Date */}
          <div className="text-left sm:text-right bg-slate-50 p-3 rounded-md border border-slate-200 print:border-slate-300 print:bg-slate-50">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
              LR / Consignment No.
            </div>
            <div className="text-xl sm:text-2xl font-black text-blue-900 tracking-wider font-mono">
              {booking.lrNumber}
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-0.5" suppressHydrationWarning>
              Booked: {formattedDate}
            </div>
          </div>
        </div>
      </div>

      {/* STATUS BADGE */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-2 rounded-md mb-6 print:border-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Current Status:
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-900 text-white uppercase tracking-wider">
            {booking.status.replace(/_/g, " ")}
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-700">
          Mode: <span className="font-bold text-slate-900">{booking.pickupMethod.replace(/_/g, " ")}</span>
        </div>
      </div>

      {/* 2. SENDER & RECEIVER DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Sender Box */}
        <div className="border border-slate-300 rounded-md p-4 bg-slate-50/50 print:bg-white">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1.5 mb-2.5 flex items-center justify-between">
            <span>Consignor (Sender)</span>
            <span className="text-[10px] text-slate-500 font-normal">ORIGIN</span>
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-bold text-slate-900 text-base">{booking.senderName}</p>
            <p className="text-slate-700 font-mono text-sm">
              Phone: <span className="font-semibold text-slate-900">{booking.senderPhone}</span>
            </p>
            {booking.senderEmail && (
              <p className="text-xs text-slate-600">Email: {booking.senderEmail}</p>
            )}
            {booking.pickupAddress && (
              <p className="text-xs text-slate-600 mt-1.5 pt-1.5 border-t border-slate-200">
                <span className="font-semibold">Pickup Address:</span> {booking.pickupAddress}
              </p>
            )}
          </div>
        </div>

        {/* Receiver Box */}
        <div className="border border-slate-300 rounded-md p-4 bg-slate-50/50 print:bg-white">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1.5 mb-2.5 flex items-center justify-between">
            <span>Consignee (Receiver)</span>
            <span className="text-[10px] text-slate-500 font-normal">DESTINATION</span>
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-bold text-slate-900 text-base">{booking.receiverName}</p>
            <p className="text-slate-700 font-mono text-sm">
              Phone: <span className="font-semibold text-slate-900">{booking.receiverPhone}</span>
            </p>
            <p className="text-xs text-slate-500 italic mt-2 pt-1 border-t border-slate-200">
              * Parcel must be collected from destination office with valid ID.
            </p>
          </div>
        </div>
      </div>

      {/* 3. ROUTE SECTION */}
      <div className="border border-blue-900/30 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-md p-4 mb-6 shadow-sm print:bg-blue-950 print:text-white">
        <div className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-2">
          Transport Route
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-center sm:text-left">
          {/* Origin */}
          <div className="bg-white/10 p-2.5 rounded backdrop-blur-sm">
            <div className="text-[10px] uppercase font-bold text-blue-200">Origin Office</div>
            <div className="font-bold text-base text-white">{booking.originOffice.name}</div>
            <div className="text-xs text-blue-100">{booking.originOffice.city}</div>
            <div className="text-[11px] text-blue-200 mt-1 font-mono">{booking.originOffice.phone}</div>
          </div>

          {/* Arrow */}
          <div className="text-center font-bold text-lg text-blue-300 hidden sm:block">
            ➔
          </div>

          {/* Destination */}
          <div className="bg-white/10 p-2.5 rounded backdrop-blur-sm">
            <div className="text-[10px] uppercase font-bold text-blue-200">Destination Office</div>
            <div className="font-bold text-base text-white">{booking.destinationOffice.name}</div>
            <div className="text-xs text-blue-100">{booking.destinationOffice.city}</div>
            <div className="text-[11px] text-blue-200 mt-1 font-mono">{booking.destinationOffice.phone}</div>
          </div>
        </div>
      </div>

      {/* 4. CONSIGNMENT ITEM TABLE */}
      <div className="mb-6 overflow-x-auto">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Consignment Details & Parcel Breakdown
        </h3>
        <table className="w-full text-left text-xs border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 uppercase font-bold text-[11px]">
              <th className="p-2.5 border-r border-slate-300 w-12 text-center">#</th>
              <th className="p-2.5 border-r border-slate-300">Parcel Type</th>
              <th className="p-2.5 border-r border-slate-300 text-center">Quantity</th>
              <th className="p-2.5 border-r border-slate-300 text-center">Approx Weight</th>
              <th className="p-2.5 border-r border-slate-300 text-center">Pickup Method</th>
              <th className="p-2.5">Remarks / Contents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {booking.items.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-slate-50/80">
                <td className="p-2.5 border-r border-slate-300 text-center font-mono font-medium">
                  {idx + 1}
                </td>
                <td className="p-2.5 border-r border-slate-300 font-bold text-slate-900">
                  {item.parcelType.replace(/_/g, " ")}
                </td>
                <td className="p-2.5 border-r border-slate-300 text-center font-bold text-slate-900">
                  {item.quantity}
                </td>
                <td className="p-2.5 border-r border-slate-300 text-center font-mono">
                  {item.weightKg ? `${item.weightKg} kg` : "N/A"}
                </td>
                <td className="p-2.5 border-r border-slate-300 text-center font-medium">
                  {booking.pickupMethod.replace(/_/g, " ")}
                </td>
                <td className="p-2.5 text-slate-600 italic">
                  {item.remarks || "Standard Package"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. PAYMENT & QR SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 items-start">
        {/* QR Code Verification Box */}
        <div className="md:col-span-4 border border-slate-300 rounded-md p-4 text-center bg-slate-50/50 print:bg-white flex flex-col items-center justify-center">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
            Scan to Track Parcel
          </div>
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt={`QR Code for ${booking.lrNumber}`}
              className="w-32 h-32 object-contain border border-slate-200 p-1 bg-white rounded shadow-xs"
            />
          ) : (
            <div className="w-32 h-32 bg-slate-200 border border-slate-300 rounded flex items-center justify-center text-xs text-slate-500">
              QR Code
            </div>
          )}
          <p className="text-[11px] text-slate-600 font-mono mt-2 font-semibold">
            {booking.lrNumber}
          </p>
          <p className="text-[10px] text-slate-500">Official ShipKart QR Verification</p>
        </div>

        {/* Payment Summary Box */}
        <div className="md:col-span-8 border border-slate-300 rounded-md p-4 bg-slate-50/50 print:bg-white">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1.5 mb-3 flex items-center justify-between">
            <span>Payment Summary</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 uppercase">
                {booking.paymentType}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase">
                {booking.paymentMode}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between items-center">
              <span>Freight / Consignment Subtotal:</span>
              <span className="font-mono font-semibold text-slate-900">
                ₹{booking.subtotalAmount.toFixed(2)}
              </span>
            </div>
            {booking.totalPickupCharge > 0 && (
              <div className="flex justify-between items-center">
                <span>Taxi Pickup Charge:</span>
                <span className="font-mono font-semibold text-slate-900">
                  + ₹{booking.totalPickupCharge.toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t border-slate-300 pt-2 mt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-slate-900 uppercase tracking-wider">Grand Total Amount:</span>
              <span className="font-mono text-base text-blue-900">
                ₹{booking.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="text-right text-[11px] font-semibold mt-1">
              Payment Status:{" "}
              {booking.paymentStatus ? (
                <span className="text-emerald-700 font-bold uppercase">PAID</span>
              ) : (
                <span className="text-amber-700 font-bold uppercase">TO BE PAID AT DESTINATION</span>
              )}
            </div>
          </div>

          {booking.specialNotes && (
            <div className="mt-3 pt-2 border-t border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-slate-800">Notes:</span> {booking.specialNotes}
            </div>
          )}
        </div>
      </div>

      {/* 6. COMPANY HELPLINES & HEAD OFFICE */}
      <div className="border-t border-slate-300 pt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
            24x7 Customer Helpline Numbers
          </p>
          <div className="font-mono text-slate-800 space-x-3">
            <span className="font-semibold">📞 {helpline1}</span>
            <span className="font-semibold">📞 {helpline2}</span>
            <span className="font-semibold">📞 {helpline3}</span>
          </div>
        </div>

        <div>
          <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
            Head Office Address
          </p>
          <p className="text-slate-700 text-[11px] leading-tight">{headOfficeAddress}</p>
        </div>
      </div>

      {/* 7. TERMS & CONDITIONS & FOOTER */}
      <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-600 leading-normal">
        <p className="font-bold text-slate-800 uppercase tracking-wider mb-1">Terms & Conditions:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Receiver must present a valid original ID at the destination office for parcel collection.</li>
          <li>Home delivery is NOT available; all parcels are to be collected from the specified Destination Office.</li>
          <li>Keep this Digital LR / LR Number until parcel delivery is verified and completed.</li>
          <li>Goods are transported at owner's risk under standard Pooja Travels & Cargo carriage policies.</li>
        </ul>
        <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>Powered by ShipKart Digital LR System</span>
          <span>Printed on: {printTimestamp}</span>
        </div>
      </div>
    </div>
  );
};
