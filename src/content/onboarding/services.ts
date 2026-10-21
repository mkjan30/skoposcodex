import type { ServiceOnboarding } from "@/lib/onboarding/types";

// Two questions per service: the one we can't start without (required) and one helpful extra.
// `access` isn't shown in the form; it's emailed to the client as next steps.
export const onboardingServices: ServiceOnboarding[] = [
  {
    key: "local_seo",
    label: "Local SEO",
    description: "Rank higher on Google Maps and local search in your area.",
    details: [
      {
        name: "targetKeywords",
        label: "Searches you want to show up for",
        type: "textarea",
        required: true,
        placeholder: "One per line",
        help: '5–10 phrases, e.g. "emergency plumber Austin".',
      },
      {
        name: "topCompetitors",
        label: "Top local competitors",
        type: "textarea",
        placeholder: "One per line",
        help: "Up to 3 names or websites.",
      },
    ],
    access: [
      {
        platform: "Google Business Profile",
        how: "Business Profile → ⋮ → Business Profile settings → Managers → Add, then invite info@skoposcodex.com as Manager.",
      },
      {
        platform: "Google Search Console",
        how: "Settings → Users and permissions → Add user, then invite info@skoposcodex.com with Full permission.",
      },
      {
        platform: "Google Analytics",
        how: "Admin → Property access management → + → Add users, then invite info@skoposcodex.com as Editor.",
      },
    ],
  },
  {
    key: "ppc",
    label: "PPC Advertising",
    description: "Paid ads on Google, Meta and more, built to drive leads and sales.",
    details: [
      {
        name: "platforms",
        label: "Where do you want to advertise?",
        type: "checkboxes",
        required: true,
        options: [
          "Google",
          "Meta (Facebook & Instagram)",
          "Microsoft (Bing)",
          "LinkedIn",
          "TikTok",
          "YouTube",
          "Not sure",
        ],
      },
      {
        name: "targetGeography",
        label: "Where should ads show?",
        type: "textarea",
        placeholder: 'Cities, ZIP codes, radius or "Nationwide"',
      },
    ],
    access: [
      {
        platform: "Google Ads",
        how: "Admin → Access and security → +, then invite info@skoposcodex.com with Standard access.",
      },
      {
        platform: "Meta Business Manager",
        how: "Business settings → Users → People → Add, invite info@skoposcodex.com, then assign your ad account, Page and pixel.",
      },
      {
        platform: "Google Analytics",
        how: "Admin → Property access management → + → Add users, then invite info@skoposcodex.com as Editor.",
      },
    ],
  },
  {
    key: "website_design",
    label: "Website Design",
    description: "A fast, conversion-focused website that turns visitors into customers.",
    details: [
      {
        name: "requiredPages",
        label: "Pages you need",
        type: "textarea",
        required: true,
        placeholder: "One per line, e.g. Home, About, Services, Contact",
      },
      {
        name: "sitesYouLove",
        label: "Websites you love",
        type: "textarea",
        placeholder: "One per line — and what you like about each",
      },
    ],
    access: [
      {
        platform: "Website CMS",
        how: "In your site admin (WordPress, Webflow, Shopify…), go to Settings → Users and invite info@skoposcodex.com as an admin.",
      },
      {
        platform: "Domain DNS (only if we handle launch)",
        how: "Use your registrar's delegate or shared access feature to invite info@skoposcodex.com.",
      },
      {
        platform: "Google Analytics",
        how: "Admin → Property access management → + → Add users, then invite info@skoposcodex.com as Editor.",
      },
    ],
  },
  {
    key: "funnel_building",
    label: "Funnel Building",
    description: "Landing pages, offers and follow-up that turn clicks into customers.",
    details: [
      {
        name: "funnelType",
        label: "What kind of funnel do you need?",
        type: "select",
        required: true,
        options: [
          "Lead generation",
          "Book a call",
          "Webinar / event",
          "Product sales",
          "Free trial / demo",
          "Not sure",
        ],
      },
      {
        name: "crm",
        label: "CRM or email platform",
        type: "select",
        half: true,
        options: [
          "HubSpot",
          "GoHighLevel",
          "Salesforce",
          "Mailchimp",
          "Klaviyo",
          "ActiveCampaign",
          "None",
          "Other",
        ],
      },
    ],
    access: [
      {
        platform: "CRM or email platform",
        how: "Settings → Users (or Team) → Invite, then add info@skoposcodex.com with admin access.",
      },
      {
        platform: "Booking tool",
        how: "Settings → Users (or Team) → Invite, then add info@skoposcodex.com.",
      },
      {
        platform: "Google Analytics",
        how: "Admin → Property access management → + → Add users, then invite info@skoposcodex.com as Editor.",
      },
    ],
  },
  {
    key: "branding",
    label: "Branding",
    description: "Logo, identity and messaging that make your business memorable.",
    details: [
      {
        name: "brandingWork",
        label: "What do you need?",
        type: "checkboxes",
        required: true,
        options: [
          "Logo",
          "Visual identity",
          "Brand guidelines",
          "Naming",
          "Messaging / tagline",
          "Full rebrand",
          "Not sure",
        ],
      },
      {
        name: "personality",
        label: "Brand personality",
        type: "checkboxes",
        max: 3,
        help: "Pick up to 3.",
        options: [
          "Trustworthy",
          "Bold",
          "Friendly",
          "Premium",
          "Playful",
          "Innovative",
          "Down-to-earth",
          "Expert",
        ],
      },
    ],
    access: [
      {
        platform: "Shared brand folder",
        how: "Share your Google Drive, Dropbox or OneDrive brand folder with info@skoposcodex.com as an editor.",
      },
      {
        platform: "Canva (if you use it)",
        how: "Settings → People → Invite people, then add info@skoposcodex.com to your team.",
      },
    ],
  },
];

export function getOnboardingService(key: string | undefined): ServiceOnboarding | undefined {
  return onboardingServices.find((s) => s.key === key);
}
