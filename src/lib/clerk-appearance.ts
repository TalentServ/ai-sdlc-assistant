import type { Appearance } from "@clerk/types";

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "#4f46e5",
    colorBackground: "#0f172a",
    colorInputBackground: "#0f172a",
    colorInputText: "#f8fafc",
    colorText: "#f8fafc",
    colorTextSecondary: "#94a3b8",
  },
  elements: {
    // Hide phone UI — pair with Clerk Dashboard: User & authentication → Phone → OFF
    formFieldRow__phoneNumber: { display: "none" },
    formField__phoneNumber: { display: "none" },
    formFieldLabelRow__phoneNumber: { display: "none" },
    formFieldLabel__phoneNumber: { display: "none" },
    formFieldInput__phoneNumber: { display: "none" },
    formFieldInputGroup__phoneNumber: { display: "none" },
    phoneInputBox: { display: "none" },
    alternativeMethodsBlockButton__phone_code: { display: "none" },
    socialButtonsBlockButton__phone_code: { display: "none" },
  },
};
