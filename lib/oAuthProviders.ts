import { SOCIAL_ICONS } from "@/constants/lists"

export const SUPPORTED_OAUTH_PROVIDERS = ['google']
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

export const SUPPORTED_OAUTH_PROVIDERS_DETAILS: Record<SupportedOAuthProvider, {name: string, iconImg: React.ReactNode}> = {
    google: {name: "Google", iconImg: SOCIAL_ICONS.googleIcon}
}