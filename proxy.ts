import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_REDIRECT_PATHS: Record<string, string> = {
  aluno: "/aluno",
  professor: "/professores",
  recepcao: "/recepcao",
  recepção: "/recepcao",
  coordenação: "/admin",
  admin: "/admin",
};

function getRedirectPathByRole(role: string | null | undefined): string | null {
  if (!role) return null;
  return ROLE_REDIRECT_PATHS[role] ?? null;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const publicRoutes = [
    "/login",
    "/signup",
    "/auth",
    "/verify-email",
    "/reset-password",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isHomePage = pathname === "/";
  const isApiRoute = pathname.startsWith("/api/");
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  let user: { id: string } | null = null;

  try {
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Proxy auth getUser error:", error.message);
    }

    user = authUser;
  } catch (error) {
    console.error("Proxy auth unexpected error:", error);

    if (isPublicRoute || isHomePage || isApiRoute) {
      return response;
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  if (!user && !isPublicRoute && !isHomePage && !isApiRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Proxy profile role error:", profileError.message);
      return response;
    }

    const redirectPath = getRedirectPathByRole(profileData?.role);
    if (!redirectPath) {
      return response;
    }

    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
