const CLERK_APP_ID = "app_3EDFLUl344142h99kBja9WwM5LW";

export const CLERK_PHONE_SETTINGS_URL = `https://dashboard.clerk.com/apps/${CLERK_APP_ID}/user-authentication/email%2Cphone%2Cusername`;

export type ClerkAuthStatus = {
  configured: boolean;
  phoneRequired: boolean;
  dashboardUrl: string;
};

function clerkFrontendHostFromPublishableKey(publishableKey: string): string | null {
  const match = publishableKey.match(/^pk_(?:test|live)_(.+)$/);
  if (!match) return null;

  try {
    const decoded = Buffer.from(match[1], "base64").toString("utf8").replace(/\$$/, "");
    return decoded.includes(".") ? decoded : `${decoded}.clerk.accounts.dev`;
  } catch {
    return null;
  }
}

export async function getClerkAuthStatus(): Promise<ClerkAuthStatus> {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  const secretKey = process.env.CLERK_SECRET_KEY?.trim();

  if (!publishableKey || !secretKey) {
    return {
      configured: false,
      phoneRequired: false,
      dashboardUrl: CLERK_PHONE_SETTINGS_URL,
    };
  }

  const host = clerkFrontendHostFromPublishableKey(publishableKey);
  if (!host) {
    return {
      configured: true,
      phoneRequired: false,
      dashboardUrl: CLERK_PHONE_SETTINGS_URL,
    };
  }

  try {
    const response = await fetch(`https://${host}/v1/environment`, {
      headers: { Authorization: `Bearer ${publishableKey}` },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return {
        configured: true,
        phoneRequired: false,
        dashboardUrl: CLERK_PHONE_SETTINGS_URL,
      };
    }

    const data = (await response.json()) as {
      user_settings?: {
        attributes?: {
          phone_number?: { required?: boolean; enabled?: boolean };
        };
      };
    };

    const phone = data.user_settings?.attributes?.phone_number;
    const phoneRequired = Boolean(phone?.enabled && phone?.required);

    return {
      configured: true,
      phoneRequired,
      dashboardUrl: CLERK_PHONE_SETTINGS_URL,
    };
  } catch {
    return {
      configured: true,
      phoneRequired: false,
      dashboardUrl: CLERK_PHONE_SETTINGS_URL,
    };
  }
}
