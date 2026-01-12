// import { type NextRequest, NextResponse } from "next/server";
// import { createServerClient } from '@supabase/ssr';

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   });

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             request.cookies.set(name, value)
//           );
//           response = NextResponse.next({
//             request,
//           });
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   // OCHRANA ADMIN SEKCE
//   if (request.nextUrl.pathname.startsWith("/admin") && !user) {
//     const loginUrl = new URL("/login", request.url);
//     // (Volitelné) Můžeme přidat parametr, kam ho vrátit po přihlášení
//     // loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
//     return NextResponse.redirect(loginUrl);
//   }

//   // OCHRANA LOGIN STRÁNKY
//   // Pokud je uživatel už přihlášen a jde na "/login", hoď ho rovnou do adminu
//   if (request.nextUrl.pathname === "/login" && user) {
//     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//   }

//   return response;
// }

// export const config = {
//   /*
//    * Matcher zajistí, že middleware běží jen na relevantních cestách.
//    * Vynecháváme statické soubory, obrázky atd.
//    */
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };
