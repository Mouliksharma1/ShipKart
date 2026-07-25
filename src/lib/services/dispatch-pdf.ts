import { BookingStatus, DispatchStatus } from "@prisma/client";

export interface LoadedParcelManifestItem {
  lrNumber: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  parcelTypes: string;
  quantity: number;
  weightKg: number;
  paymentType: string;
  totalAmount: number;
  status: BookingStatus;
}

export interface DispatchManifestData {
  dispatchNumber: string;
  vehicleNumber: string;
  driverName?: string | null;
  driverPhone?: string | null;
  originOfficeName: string;
  destinationOfficeName: string;
  status: DispatchStatus;
  createdAt: string;
  departureTime?: string | null;
  estimatedArrival?: string | null;
  totalLrCount: number;
  totalParcelCount: number;
  totalWeightKg: number;
  totalValue: number;
  items: LoadedParcelManifestItem[];
}

export function generateDispatchManifestHtml(data: DispatchManifestData): string {
  const itemRows = data.items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
        <td style="padding: 8px 6px; text-align: center; font-weight: bold;">${idx + 1}</td>
        <td style="padding: 8px 6px; font-weight: bold; color: #1e293b;">${item.lrNumber}</td>
        <td style="padding: 8px 6px;">
          <div style="font-weight: bold; color: #0f172a;">${item.senderName}</div>
          <div style="color: #64748b; font-size: 10px;">${item.senderPhone}</div>
        </td>
        <td style="padding: 8px 6px;">
          <div style="font-weight: bold; color: #0f172a;">${item.receiverName}</div>
          <div style="color: #64748b; font-size: 10px;">${item.receiverPhone}</div>
        </td>
        <td style="padding: 8px 6px; text-align: center;">${item.parcelTypes}</td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold;">${item.quantity}</td>
        <td style="padding: 8px 6px; text-align: center;">${item.weightKg} kg</td>
        <td style="padding: 8px 6px; text-align: right; font-weight: bold; color: #047857;">
          ₹${item.totalAmount} (${item.paymentType})
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dispatch Manifest - ${data.dispatchNumber}</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; margin: 0; padding: 0; background: #fff; }
          .manifest-container { width: 100%; max-width: 800px; margin: 0 auto; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #d97706; padding-bottom: 12px; margin-bottom: 16px; }
          .company-title { font-size: 20px; font-weight: 900; color: #d97706; text-transform: uppercase; letter-spacing: 0.5px; }
          .company-sub { font-size: 11px; font-weight: 600; color: #475569; }
          .dispatch-badge { font-size: 16px; font-weight: 900; background: #fef3c7; color: #92400e; padding: 6px 12px; border-radius: 6px; border: 1px solid #fde68a; }
          .grid-meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 16px; font-size: 11px; }
          .meta-item { display: flex; flex-direction: column; }
          .meta-label { font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; }
          .meta-val { font-size: 12px; font-weight: 800; color: #0f172a; margin-top: 2px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th { background: #1e293b; color: #fff; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 8px 6px; text-align: left; }
          .summary-bar { display: flex; justify-content: space-between; background: #fffbeb; border: 1px solid #fde68a; padding: 10px 16px; border-radius: 8px; font-size: 12px; font-weight: 800; color: #92400e; margin-bottom: 30px; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 40px; }
          .sig-box { border-top: 1px dashed #94a3b8; text-align: center; padding-top: 8px; font-size: 10px; font-weight: 700; color: #475569; }
        </style>
      </head>
      <body>
        <div class="manifest-container">
          <div class="header">
            <div>
              <div class="company-title">Pooja Travels & Cargo</div>
              <div class="company-sub">Dispatch Manifest & Trip Sheet</div>
            </div>
            <div class="dispatch-badge">${data.dispatchNumber}</div>
          </div>

          <div class="grid-meta">
            <div class="meta-item">
              <span class="meta-label">Vehicle Number</span>
              <span class="meta-val">${data.vehicleNumber}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Driver Details</span>
              <span class="meta-val">${data.driverName || "N/A"} ${data.driverPhone ? `(${data.driverPhone})` : ""}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Origin Counter</span>
              <span class="meta-val">${data.originOfficeName}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Destination Counter</span>
              <span class="meta-val">${data.destinationOfficeName}</span>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">#</th>
                <th style="width: 100px;">LR Number</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th style="text-align: center;">Type</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: center;">Weight</th>
                <th style="text-align: right;">Freight</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <div class="summary-bar">
            <div>TOTAL LRs: ${data.totalLrCount}</div>
            <div>PARCELS: ${data.totalParcelCount} items</div>
            <div>TOTAL WEIGHT: ${data.totalWeightKg} kg</div>
            <div>TOTAL FREIGHT: ₹${data.totalValue}</div>
          </div>

          <div class="signatures">
            <div class="sig-box">Loaded By (Origin Clerk)</div>
            <div class="sig-box">Driver Signature</div>
            <div class="sig-box">Received By (Destination Clerk)</div>
          </div>
        </div>
      </body>
    </html>
  `;
}
