import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/middleware-auth";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/customer",
    "/customer/:path*",
    "/employee",
    "/employee/:path*",
    "/partner",
    "/partner/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
