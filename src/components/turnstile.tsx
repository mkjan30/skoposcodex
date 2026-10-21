"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; theme: "dark" }) => string;
      reset: (widget: string) => void;
      remove: (widget: string) => void;
      getResponse: (widget: string) => string | undefined;
    };
  }
}

/**
 * Cloudflare Turnstile, rendered explicitly so it also appears after client-side navigation.
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset. Tokens are single-use: call
 * reset() after every failed submit.
 */
export function useTurnstile() {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const render = useCallback(() => {
    if (!siteKey || !window.turnstile || !ref.current || id.current) return;
    id.current = window.turnstile.render(ref.current, { sitekey: siteKey, theme: "dark" });
  }, [siteKey]);

  useEffect(
    () => () => {
      if (id.current) window.turnstile?.remove(id.current);
      id.current = null;
    },
    [],
  );

  // Callback ref: when the container remounts (e.g. a wizard step is left and revisited),
  // drop the old widget and render a fresh one into the new element.
  const setContainer = useCallback(
    (el: HTMLDivElement | null) => {
      if (id.current) window.turnstile?.remove(id.current);
      id.current = null;
      ref.current = el;
      render();
    },
    [render],
  );

  const reset = useCallback(() => {
    if (id.current) window.turnstile?.reset(id.current);
  }, []);

  const token = useCallback(
    () => (id.current ? (window.turnstile?.getResponse(id.current) ?? null) : null),
    [],
  );

  const widget = siteKey ? (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={render}
      />
      <div ref={setContainer} className="min-h-[65px]" />
    </>
  ) : null;

  return { widget, reset, token };
}
