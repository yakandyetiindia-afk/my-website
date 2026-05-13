import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Hilarious@123";

export function proxy(request) {
  const authHeader = request.headers.get("authorization") || "";
  const [scheme, encoded] = authHeader.split(" ");

  if (scheme === "Basic" && encoded) {
    const credentials = atob(encoded);
    const password = credentials.split(":").slice(1).join(":");
    if (password === ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Yak & Yeti Admin"'
    }
  });
}

export const config = {
  matcher: ["/admin/:path*"]
};
