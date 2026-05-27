"use client";

import { useEffect } from "react";

function stripHiddenPhoneRequirements(root: ParentNode) {
  root.querySelectorAll('input[name="phoneNumber"]').forEach((node) => {
    if (!(node instanceof HTMLInputElement)) return;

    node.required = false;
    node.removeAttribute("required");
    node.setAttribute("aria-required", "false");
    node.disabled = true;
    node.tabIndex = -1;
  });
}

/** Prevents silent HTML5 validation when Clerk phone fields are hidden via appearance. */
export function ClerkHiddenPhoneFix() {
  useEffect(() => {
    stripHiddenPhoneRequirements(document);

    const observer = new MutationObserver(() => {
      stripHiddenPhoneRequirements(document);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
