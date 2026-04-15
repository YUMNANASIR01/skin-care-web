import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy - runs at the Edge for auth checks
 * Protects /chat and /appointment routes - requires sign in
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/chat", "/appointment"];
  
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Allow public routes
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get session cookies
  const cookies = request.cookies.getAll();
  
  // Check for NextAuth session tokens
  const hasValidSession = cookies.some(
    (cookie) =>
      cookie.name === "next-auth.session-token" ||
      cookie.name === "__Secure-next-auth.session-token" ||
      (cookie.name.startsWith("__Secure-next-auth.session-token.") && cookie.value)
  );

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[PROXY] Path: ${pathname}`);
    console.log(`[PROXY] Protected: ${isProtectedRoute}`);
    console.log(`[PROXY] Has session: ${hasValidSession}`);
    console.log(`[PROXY] Cookies:`, cookies.map((c) => c.name).join(", "));
  }

  // Redirect to auth page if no valid session
  if (!hasValidSession) {
    const authUrl = new URL("/auth", request.url);
    authUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(authUrl);
  }

  // Allow access with valid session
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)",
  ],
};
