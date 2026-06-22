
import ip from "@arcjet/ip";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { 
  BotOptions, 
  EmailOptions, 
  SlidingWindowRateLimitOptions 
} from "@arcjet/next";
import arcjet, { 
  ArcjetDecision, 
  detectBot, 
  protectSignup, 
  shield, 
  slidingWindow 
} from "arcjet";
import { getEnv } from "@/lib/utils";

const aj = arcjet({
  key: getEnv("ARCJET_API_KEY"),
  characteristics: ['userIdOrIp'],
  rules: [shield({ mode: "LIVE"})]
})

const botSettings = {
  mode: "LIVE",
  allow: [],
} satisfies BotOptions

const emailValidation = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions


const restrictiveRateLimitSettings = {
  mode: "LIVE",
  interval: "2m",
  max: 2,
  characteristics: [],
} satisfies SlidingWindowRateLimitOptions<[]>

const laxRateLimitSettings = {
  mode: "LIVE",
  interval: "1m",
  max: 60,
} satisfies SlidingWindowRateLimitOptions<string[]>


const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  const body = await req.json();
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  let userIdOrIp: string;
  if (session?.user.id) {
    userIdOrIp = session.user.id;
  } else {
    userIdOrIp = ip(req) || "127.0.0.1";
  }

  if (req.nextUrl.pathname.startsWith("/api/auth/sign-in")) {
    if (typeof body.email === "string") {
      aj.withRule(protectSignup({
        email: emailValidation,
        bots: botSettings,
        rateLimit: restrictiveRateLimitSettings,
        })
      ).protect(body, {email: body.email, userIdOrIp});
    }
    else {
      return aj.withRule(detectBot(botSettings)).withRule(slidingWindow(restrictiveRateLimitSettings)).protect(body, {userIdOrIp})
    }
  }
  return aj
    .withRule(detectBot(botSettings))
    .withRule(slidingWindow(laxRateLimitSettings))
    .protect(body, {userIdOrIp});
};

const authHandlers = toNextJsHandler(auth);

export const { GET } = authHandlers;

export const POST = async (req: NextRequest) => {
  const clonedRequest = req.clone()
  const decision = await protectedAuth(req);
  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      let message: string

      if(decision.reason.emailTypes.includes('INVALID')) {
        message = "Please provide a valid email address"
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email address are not allowed"
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "Email domain is not valid"
      } else {
        message = "Invalid email"
      }

      return Response.json(message, {status: 400});
    } else if (decision.reason.isRateLimit()) {
      return new Response(null, {status: 429});
    } else {
      return new Response (null, {status: 400})
    }
  }
  return authHandlers.POST(clonedRequest);
};
