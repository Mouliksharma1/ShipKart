import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Package, 
  User, 
  MapPin, 
  Truck, 
  CreditCard, 
  Clock, 
  RotateCcw, 
  ArrowLeft, 
  CheckCircle2, 
  FileText,
  Building,
  QrCode
} from "lucide-react";
import { getBookingAction } from "@/app/actions/employee-booking";

export const metadata = {
  title: "Consignment Booking Details | Pooja Travels & Cargo",
};

export default async function EmployeeBookingDetailPage({ params }: { params: Promise<{ lr: string }> }) {
  const { lr } = await params;
  const res = await getBookingAction(lr);

  if (!res.success || !res.data) {
    notFound();
  }

  const b = res.data;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            href="/employee/bookings"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-neutral-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Bookings</span>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href={`/employee/book?repeatLr=${b.lrNumber}`}
              className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all flex items-center space-x-1.5"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Repeat Booking</span>
            </Link>
          </div>
        </div>

        {/* MASTER HEADER CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-neutral-800 pb-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                OFFICIAL CONSIGNMENT LR
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
                {b.lrNumber}
              </h1>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                Booked on {new Date(b.createdAt).toLocaleString("en-IN")} • Mode: {b.pickupMethod}
              </p>
            </div>

            <div className="text-left md:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {b.status}
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{b.totalAmount}
              </p>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Payment: {b.paymentType} ({b.paymentMode})
              </p>
            </div>
          </div>

          {/* SENDER & RECEIVER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-2">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Sender Information
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-white">{b.senderName}</p>
              <p className="text-xs text-slate-600 dark:text-neutral-400">Mobile: {b.senderPhone}</p>
              {b.senderEmail && <p className="text-xs text-slate-500">Email: {b.senderEmail}</p>}
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-neutral-800">
                Origin Office: <strong className="text-slate-800 dark:text-neutral-200">{b.originOffice?.name} ({b.originOffice?.city})</strong>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-2">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Receiver Information
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-white">{b.receiverName}</p>
              <p className="text-xs text-slate-600 dark:text-neutral-400">Mobile: {b.receiverPhone}</p>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-neutral-800">
                Destination Office: <strong className="text-slate-800 dark:text-neutral-200">{b.destinationOffice?.name} ({b.destinationOffice?.city})</strong>
              </p>
            </div>
          </div>

          {/* PARCEL ITEMS TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Package className="h-4 w-4 text-purple-500" />
                <span>Consignment Item Snapshots</span>
              </h3>
              {b.totalAmount !== b.subtotalAmount + b.totalPickupCharge && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  Custom Counter Rate Applied
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 uppercase">
                    <th className="py-2.5 px-3 font-semibold">Parcel Type</th>
                    <th className="py-2.5 px-3 font-semibold">Quantity</th>
                    <th className="py-2.5 px-3 font-semibold">Weight</th>
                    <th className="py-2.5 px-3 font-semibold">Unit Tariff</th>
                    <th className="py-2.5 px-3 font-semibold">Subtotal</th>
                    <th className="py-2.5 px-3 font-semibold">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                  {b.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{item.parcelType}</td>
                      <td className="py-3 px-3">{item.quantity}</td>
                      <td className="py-3 px-3">{item.weightKg} KG</td>
                      <td className="py-3 px-3">₹{item.unitPrice}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">₹{item.subtotal}</td>
                      <td className="py-3 px-3 text-slate-500">{item.remarks || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 dark:border-neutral-800 font-bold">
                    <td colSpan={4} className="py-3 px-3 text-right text-slate-700 dark:text-neutral-300">
                      Total Charged Amount ({b.paymentType}):
                    </td>
                    <td colSpan={2} className="py-3 px-3 text-amber-600 dark:text-amber-400 text-base">
                      ₹{b.totalAmount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* TRACKING TIMELINE */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span>Tracking Status Timeline</span>
            </h3>

            <div className="space-y-2">
              {b.trackingHistory.map((th: any) => (
                <div key={th.id} className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{th.status}</span>
                    <p className="text-[11px] text-slate-500">{th.notes}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(th.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PLACEHOLDERS FOR MILESTONE 7 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
              <QrCode className="h-6 w-6 text-amber-500 mx-auto" />
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400">QR Code Generation</p>
              <p className="text-[10px] text-slate-400">(Milestone 7 Digital LR)</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center space-y-1">
              <FileText className="h-6 w-6 text-blue-500 mx-auto" />
              <p className="text-xs font-bold text-blue-700 dark:text-blue-400">Download Official LR PDF</p>
              <p className="text-[10px] text-slate-400">(Milestone 7 Digital LR)</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
