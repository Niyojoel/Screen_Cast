import { getEnv } from '@/lib/utils';
import { db } from "@/drizzle/db";
import { schema } from "@/drizzle/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,

  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    }
  },
  socialProviders: {
    google: {
      clientId: getEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
    },
  },
  plugins: [nextCookies()],
  baseURL: getEnv("NEXT_PUBLIC_BASE_URL"),
});


