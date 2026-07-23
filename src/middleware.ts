import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/middleware-auth";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/employee/:path*",
    "/partner/:path*",
    "/admin/:path*",
  ],
};
