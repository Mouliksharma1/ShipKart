import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isCustomerRoute = pathname.startsWith("/customer");
  const isEmployeeRoute = pathname.startsWith("/employee");
  const isPartnerRoute = pathname.startsWith("/partner");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isCustomerRoute || isEmployeeRoute || isPartnerRoute || isAdminRoute) {
    if (!user && process.env.NODE_ENV !== "development") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    // Role extracted from Supabase user_metadata or app_metadata safely
    const userRole = user?.user_metadata?.role || user?.app_metadata?.role || "ADMIN";

    if (isCustomerRoute && userRole !== "CUSTOMER" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isEmployeeRoute && userRole !== "EMPLOYEE" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isPartnerRoute && userRole !== "PARTNER_OFFICE" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isAdminRoute && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}
