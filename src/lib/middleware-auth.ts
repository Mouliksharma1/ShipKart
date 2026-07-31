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

  // 1. EMPLOYEE ROUTES AUTHENTICATION
  if (isEmployeeRoute) {
    const isEmployeeLoginPage = pathname === "/employee/login";

    if (isEmployeeLoginPage) {
      // If already authenticated, redirect to /employee dashboard
      if (staffId) {
        return NextResponse.redirect(new URL("/employee", request.url));
      }
      return NextResponse.next();
    }

    // Require valid staff session cookie for all /employee routes
    if (!staffId) {
      const loginUrl = new URL("/employee/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. ADMIN ROUTES AUTHENTICATION & ROLE AUTHORIZATION
  if (isAdminRoute) {
    const isAdminLoginPage = pathname === "/admin/login" || pathname === "/login";
    if (!isAdminLoginPage) {
      if (!staffId) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Restrict Admin routes strictly to ADMIN and SUPER_ADMIN roles
      if (staffRole && staffRole !== "ADMIN" && staffRole !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/employee", request.url));
      }
    }
  }

  // 3. CUSTOMER & PARTNER SUPABASE AUTH CHECK
  if (isCustomerRoute || isPartnerRoute) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

    let response = NextResponse.next({ request: { headers: request.headers } });

    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user && !staffId) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(url);
      }
    } catch (_) {}
  }

  return NextResponse.next();
}
