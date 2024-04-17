import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOGIN_REDIRECT, authRoutes, publicRoutes } from "./routes";
import { TOKEN } from "./cookie";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(TOKEN);

  if (token) {
    if (authRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    } else if (req.nextUrl.pathname.startsWith("/@me")) {
      const { pathname, origin, searchParams } = req.nextUrl;
      return NextResponse.rewrite(
        new URL(`/me${pathname.replace("/@me", "")}?${searchParams}`, origin)
      );
    } else if (req.nextUrl.pathname == "/me") {
      return NextResponse.redirect(new URL("/404", req.nextUrl));
    } else {
      return NextResponse.next();
    }
  } else {
    const publicRoute = [...publicRoutes, ...authRoutes];
    if (publicRoute.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL(authRoutes[0], req.url));
    }
  }
}

export const config = {
  matcher: "/((?!api|favicon.ico|_next/static|_next/image|assets).*)",
};
