import type { Field, UploadSlot } from "@/lib/onboarding/types";

// Kept deliberately short (≈3 minutes). Anything else is collected on the kickoff call.
// businessName/contactName/email/phone/websiteUrl and monthlyBudget are promoted to columns server-side.

/** Step 2 "About you". */
export const businessFields: Field[] = [
  {
    name: "businessName",
    label: "Business name",
    type: "text",
    required: true,
    placeholder: "Acme Plumbing LLC",
  },
  {
    name: "contactName",
    label: "Your name",
    type: "text",
    required: true,
    placeholder: "Jane Smith",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    half: true,
    placeholder: "jane@acmeplumbing.com",
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    required: true,
    half: true,
    placeholder: "(555) 123-4567",
  },
  {
    name: "websiteUrl",
    label: "Website",
    type: "url",
    placeholder: "https://acmeplumbing.com",
    help: "Leave blank if you don't have one yet.",
  },
  {
    name: "industry",
    label: "Industry",
    type: "select",
    required: true,
    options: [
      "Home services",
      "Health & wellness",
      "Legal & professional",
      "Restaurant & hospitality",
      "Retail & e-commerce",
      "Real estate",
      "Automotive",
      "Other",
    ],
  },
];

/** Step 3, shared part: goals + an optional catch-all. */
export const goalsFields: Field[] = [
  {
    name: "primaryGoal",
    label: "Main goal for the next 6 months",
    type: "select",
    required: true,
    options: [
      "More leads or calls",
      "More online sales",
      "Better local visibility",
      "Launch a new brand or site",
      "Lower cost per lead",
      "Other",
    ],
  },
  {
    name: "monthlyBudget",
    label: "Monthly marketing budget",
    type: "select",
    required: true,
    half: true,
    help: "Our fees plus any ad spend.",
    options: [
      "Under $1,000",
      "$1,000–$2,500",
      "$2,500–$5,000",
      "$5,000–$10,000",
      "$10,000+",
      "Not sure",
    ],
  },
  {
    name: "timeline",
    label: "How soon do you want to start?",
    type: "select",
    required: true,
    half: true,
    options: ["As soon as possible", "Within 1 month", "1–3 months", "Just exploring"],
  },
  {
    name: "notes",
    label: "Anything else we should know?",
    type: "textarea",
    placeholder: "Your biggest challenge, a deadline, a competitor you want to beat…",
    help: "Optional — we'll ask for anything else on the kickoff call.",
  },
];

/** One optional uploader for every service (step 3). */
export const onboardingUploads: UploadSlot[] = [
  {
    slot: "assets",
    label: "Logo or brand files",
    help: "Optional — logo, brand guide, past reports. You can always send more later.",
  },
];
