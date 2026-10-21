import { describe, expect, it } from "vitest";

import { isSalesPitch } from "./spam";

describe("isSalesPitch", () => {
  it("flags the SEO-audit cold pitch", () => {
    const msg = `Hi
I wanted to quickly flag something we found while checking your website.
Your SEO (Search Engine Optimization) setup appears to have some incomplete technical elements affecting search-engine crawling, indexing, and overall visibility on Google and Bing.
The concern is that if your important pages aren't being properly crawled and indexed, potential customers searching for your services may not find you at all, while your competitors continue taking those clicks and enquiries.
If you have a few minutes, reply with your phone number and a convenient time. I can walk you through what we found.`;
    expect(isSalesPitch(msg)).toBe(true);
  });

  it("flags a web-dev agency pitch", () => {
    expect(
      isSalesPitch(
        "Hello, we are a web development company. Our services include SEO and design. Get your website on the first page of Google.",
      ),
    ).toBe(true);
  });

  it("lets real enquiries through", () => {
    for (const msg of [
      "We run two dental clinics in Austin and want more local patients. Our website is old and slow — can you redesign it and help with local SEO?",
      "I saw your website and liked the portfolio. Need a new site for my roofing business, budget around $5k.",
      "Our Google rankings dropped after a redesign. Can you take a look at our SEO?",
    ]) {
      expect(isSalesPitch(msg)).toBe(false);
    }
  });
});
