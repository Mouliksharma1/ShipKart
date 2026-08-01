import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isEmployeeRoute = pathname.startsWith("/employee");
  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute = pathname.startsWith("/customer");
  const isPartnerRoute = pathname.startsWith("/partner");

  const staffId = request.cookies.get("shipkart_staff_id")?.value;
  const staffRole = request.cookies.get("shipkart_staff_role")?.value;
  const customerPhone = request.cookies.get("shipkart_customer_phone")?.value;

  const STAFF_ROLES = ["COUNTER_EMPLOYEE", "ACCOUNTANT", "EMPLOYEE", "MANAGER", "ADMIN", "SUPER_ADMIN"];

  // 1. CUSTOMER ROUTES PROTECTION
  if (isCustomerRoute) {
    // If logged in as staff/employee/admin, block access to /customer and redirect to /employee
    if (staffRole && STAFF_ROLES.includes(staffRole)) {
      return NextResponse.redirect(new URL("/employee", request.url));
    }

    // Require valid customer session cookie
    if (!customerPhone && !staffId) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. EMPLOYEE ROUTES AUTHENTICATION & PROTECTION
  if (isEmployeeRoute) {
    const isEmployeeLoginPage = pathname === "/employee/login";

    if (isEmployeeLoginPage) {
      if (staffId && staffRole && STAFF_ROLES.includes(staffRole)) {
        return NextResponse.redirect(new URL("/employee", request.url));
      }
      return NextResponse.next();
    }

    // Block customer roles from accessing employee terminal
    if (staffRole === "CUSTOMER") {
      return NextResponse.redirect(new URL("/customer", request.url));
    }

    // Require valid staff session cookie for all /employee routes
    if (!staffId || !staffRole || !STAFF_ROLES.includes(staffRole)) {
      const loginUrl = new URL("/employee/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. ADMIN ROUTES AUTHENTICATION & ROLE AUTHORIZATION
  if (isAdminRoute) {
    const isAdminLoginPage = pathname === "/admin/login" || pathname === "/loginofthelegendofshipkart" || pathname === "/login";
    if (!isAdminLoginPage) {
      if (!staffId) {
        const loginUrl = new URL("/employee/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Restrict Admin routes strictly to ADMIN and SUPER_ADMIN roles
      if (staffRole && staffRole !== "ADMIN" && staffRole !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/employee", request.url));
      }
    }
  }

  // 4. PARTNER ROUTES AUTHENTICATION & PROTECTION
  if (isPartnerRoute) {
    if (staffRole !== "PARTNER_OFFICE") {
      if (staffRole === "CUSTOMER") {
        return NextResponse.redirect(new URL("/customer", request.url));
      }
      return NextResponse.redirect(new URL("/employee", request.url));
    }
  }

  return NextResponse.next();
}
