import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {getUser} from "@/lib/actions/getByIfOnline"
import { getEnv } from "./lib/utils";
import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";

export async function middleware(request: NextRequest) {
  
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  const user = getUser()

  // if (!user && request.nextUrl.pathname !== "/" && !(request.nextUrl.pathname.startsWith('/video'))) {
  //   return NextResponse.redirect(new URL("/auth", request.url));
  // }

  // return NextResponse.next();
}
const aj = arcjet({
  key: getEnv("ARCJET_API_KEY"),
  rules: [],
});

const validate = aj
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "G00G1E_CRAWLER"], // allow other bots if you want to.
    })
  );

export default createMiddleware(validate);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sign-in|video|assets$).*)"],
};

// ⨯ [TypeError: Body is unusable: Body has already been read]
