import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { generateQRCodeDataUrl } from "@/lib/services/qrcode";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0f172a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a8a",
    paddingBottom: 10,
    marginBottom: 12,
  },
  brandBox: {
    flexDirection: "column",
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
  },
  tagline: {
    fontSize: 9,
    color: "#1d4ed8",
    fontWeight: "bold",
    marginTop: 2,
  },
  lrBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 6,
    borderRadius: 4,
    textAlign: "right",
  },
  lrLabel: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
  },
  lrNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginTop: 2,
  },
  dateText: {
    fontSize: 8,
    color: "#475569",
    marginTop: 2,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    padding: 6,
    borderRadius: 4,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1e3a8a",
    textTransform: "uppercase",
  },
  gridTwo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 4,
  },
  cardTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1e3a8a",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  boldName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 9,
    color: "#334155",
  },
  routeBox: {
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    padding: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
  routeTitle: {
    fontSize: 8,
    color: "#93c5fd",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  routeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  officeBlock: {
    width: "42%",
  },
  officeName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
  officeCity: {
    fontSize: 9,
    color: "#dbeafe",
  },
  arrowText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#93c5fd",
  },
  table: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    padding: 5,
    fontWeight: "bold",
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    padding: 5,
    fontSize: 8,
  },
  col1: { width: "8%", textAlign: "center" },
  col2: { width: "30%", fontWeight: "bold" },
  col3: { width: "15%", textAlign: "center" },
  col4: { width: "15%", textAlign: "center" },
  col5: { width: "32%" },
  bottomSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  qrBox: {
    width: "35%",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 8,
    alignItems: "center",
    borderRadius: 4,
  },
  qrImage: {
    width: 90,
    height: 90,
  },
  qrLabel: {
    fontSize: 7,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },
  paymentBox: {
    width: "65%",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#f8fafc",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: 9,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    paddingTop: 4,
    marginTop: 4,
    fontSize: 11,
    fontWeight: "bold",
  },
  helplineSection: {
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    paddingTop: 6,
    marginBottom: 8,
  },
  helplineTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  termsSection: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 6,
    fontSize: 7,
    color: "#64748b",
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#94a3b8",
  },
});

export type LRPDFData = {
  booking: any;
  companySettings?: any;
  qrCodeDataUrl: string;
};

export const LRPDFDocument: React.FC<LRPDFData> = ({
  booking,
  companySettings,
  qrCodeDataUrl,
}) => {
  const formattedDate = new Date(booking.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Document title={`Digital LR - ${booking.lrNumber}`}>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.brandBox}>
            <Text style={styles.companyName}>
              {companySettings?.companyName || "POOJA TRAVELS & CARGO"}
            </Text>
            <Text style={styles.tagline}>
              ShipKart Digital Lorry Receipt (Builty)
            </Text>
          </View>
          <View style={styles.lrBox}>
            <Text style={styles.lrLabel}>LR / Consignment No.</Text>
            <Text style={styles.lrNumber}>{booking.lrNumber}</Text>
            <Text style={styles.dateText}>Booked: {formattedDate}</Text>
          </View>
        </View>

        {/* STATUS & BOOKED BY */}
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            Status: {booking.status.replace(/_/g, " ")}
          </Text>
          <Text style={{ fontSize: 9, fontWeight: "bold", color: "#1e3a8a", textTransform: "uppercase" }}>
            BOOKED BY :- {!booking.createdBy || booking.createdBy.role === "CUSTOMER" ? "SELF" : (booking.createdBy.name ? booking.createdBy.name.toUpperCase() : "COUNTER STAFF")}
          </Text>
        </View>

        {booking.status === "CANCELLED" && (
          <View style={{ backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fca5a5", padding: 6, marginBottom: 8, borderRadius: 4 }}>
            <Text style={{ fontSize: 9, fontWeight: "bold", color: "#991b1b" }}>
              {booking.lastUpdatedBy?.startsWith("LR CANCELLED BY")
                ? booking.lastUpdatedBy
                : `LR CANCELLED BY :- ${booking.lastUpdatedBy || "STAFF"}`}
            </Text>
          </View>
        )}


        {/* SENDER & RECEIVER */}
        <View style={styles.gridTwo}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Consignor (Sender)</Text>
            <Text style={styles.boldName}>{booking.senderName}</Text>
            <Text style={styles.phoneText}>Phone: {booking.senderPhone}</Text>
            {booking.senderEmail ? (
              <Text style={{ fontSize: 8, color: "#64748b", marginTop: 2 }}>
                Email: {booking.senderEmail}
              </Text>
            ) : null}
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Consignee (Receiver)</Text>
            <Text style={styles.boldName}>{booking.receiverName}</Text>
            <Text style={styles.phoneText}>Phone: {booking.receiverPhone}</Text>
            <Text style={{ fontSize: 7, color: "#64748b", marginTop: 4 }}>
              * Parcel must be collected at Destination Office
            </Text>
          </View>
        </View>

        {/* ROUTE */}
        <View style={styles.routeBox}>
          <Text style={styles.routeTitle}>Transport Route</Text>
          <View style={styles.routeRow}>
            <View style={styles.officeBlock}>
              <Text style={styles.officeName}>{booking.originOffice.name}</Text>
              <Text style={styles.officeCity}>{booking.originOffice.city}</Text>
            </View>
            <Text style={styles.arrowText}>➔</Text>
            <View style={styles.officeBlock}>
              <Text style={styles.officeName}>
                {booking.destinationOffice.name}
              </Text>
              <Text style={styles.officeCity}>
                {booking.destinationOffice.city}
              </Text>
            </View>
          </View>
        </View>

        {/* ITEMS TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>Parcel Type</Text>
            <Text style={styles.col3}>Quantity</Text>
            <Text style={styles.col4}>Approx Weight</Text>
            <Text style={styles.col5}>Remarks / Contents</Text>
          </View>
          {booking.items.map((item: any, idx: number) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.col1}>{idx + 1}</Text>
              <Text style={styles.col2}>{item.parcelType.replace(/_/g, " ")}</Text>
              <Text style={styles.col3}>{item.quantity}</Text>
              <Text style={styles.col4}>
                {item.weightKg ? `${item.weightKg} kg` : "N/A"}
              </Text>
              <Text style={styles.col5}>{item.remarks || "Standard Package"}</Text>
            </View>
          ))}
        </View>

        {/* QR & PAYMENT */}
        <View style={styles.bottomSection}>
          <View style={styles.qrBox}>
            <Image src={qrCodeDataUrl} style={styles.qrImage} />
            <Text style={styles.qrLabel}>Scan QR to Track Parcel Online</Text>
          </View>
          <View style={styles.paymentBox}>
            <Text style={styles.cardTitle}>Payment Summary</Text>
            <View style={styles.paymentRow}>
              <Text>Freight Subtotal:</Text>
              <Text>₹{booking.subtotalAmount.toFixed(2)}</Text>
            </View>
            {booking.totalPickupCharge > 0 ? (
              <View style={styles.paymentRow}>
                <Text>Pickup Charge:</Text>
                <Text>+ ₹{booking.totalPickupCharge.toFixed(2)}</Text>
              </View>
            ) : null}
            <View style={styles.grandTotalRow}>
              <Text>Grand Total Amount:</Text>
              <Text>₹{booking.totalAmount.toFixed(2)}</Text>
            </View>
            <View style={{ marginTop: 4, fontSize: 8 }}>
              <Text>
                Type: {booking.paymentType} | Mode: {booking.paymentMode}
              </Text>
              <Text style={{ fontWeight: "bold", marginTop: 2, color: booking.paymentStatus ? "#047857" : "#b45309" }}>
                Status: {booking.paymentStatus ? "PAID" : "TO BE PAID AT DESTINATION"}
              </Text>
            </View>
          </View>
        </View>

        {/* HELPLINE */}
        <View style={styles.helplineSection}>
          <Text style={styles.helplineTitle}>
            Helpline: 6350603414 | 7852091119 | 0291-2651955
          </Text>
          <Text style={{ fontSize: 7, color: "#475569" }}>
            Head Office: 45, Jaswant Building, MG Hospital Rd, Sojati Gate, Rawaton Ka Bass, Jodhpur, Rajasthan 342001
          </Text>
        </View>

        {/* TERMS */}
        <View style={styles.termsSection}>
          <Text style={{ fontWeight: "bold", marginBottom: 2 }}>Terms & Conditions:</Text>
          <Text style={{ fontStyle: "italic", marginBottom: 3 }}>
            In the event of any dispute, it shall be deemed that the merchant/party has accepted the following terms and conditions upon booking the parcel:
          </Text>
          <Text>1. Receiver must show valid ID at destination office for parcel collection.</Text>
          <Text>2. Home Delivery is NOT available; collect from Destination Office.</Text>
          <Text>3. Goods transported at owner's risk under standard Pooja Travels & Cargo carriage policies.</Text>
          <Text>4. Luggage delivery will be charged at Rs.20 per piece. After 3 days, an additional demurrage charge of Rs.10 per piece per day will apply.</Text>
          <Text>5. The company shall bear no responsibility for any breakage, damage, or spoilage of goods inside the parcel. Such risk lies entirely with the party/sender.</Text>
          <Text>6. If luggage is not collected by the party within 7 days, the company shall bear no liability whatsoever.</Text>
          <Text>7. In case of loss of luggage, the maximum claim payable shall be limited to Rs.1,000 only.</Text>
          <Text>8. All responsibilities regarding Sale Tax, GST, E-Way Bill, and related compliance shall lie solely with the party/sender.</Text>
          <Text>9. Any dispute arising shall be subject to the jurisdiction of Jodhpur courts only.</Text>
          <Text>10. Narcotic and illegal substances are strictly prohibited. If found, the party/sender shall be solely responsible.</Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>ShipKart Digital LR Engine</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

/**
 * GENERATE LR PDF BLOB / STREAM
 */
export async function generateLRPDF(
  booking: any,
  companySettings?: any
): Promise<Blob> {
  const qrCodeDataUrl = await generateQRCodeDataUrl(booking.lrNumber);
  const doc = (
    <LRPDFDocument
      booking={booking}
      companySettings={companySettings}
      qrCodeDataUrl={qrCodeDataUrl}
    />
  );
  return await pdf(doc).toBlob();
}
