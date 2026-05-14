export type MessageRole = "user" | "assistant";

export interface Citation {
  id: string;
  documentName: string;
  documentId: string;
  page: number;
  section?: string;
  snippet: string;
  relevanceScore: number; // 0-1
}

export type Confidence = "high" | "medium" | "low";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO
  citations?: Citation[];
  confidence?: Confidence;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export const SUGGESTED_PROMPTS: { label: string; prompt: string }[] = [
  { label: "Exclusions", prompt: "What exclusions exist in this policy?" },
  { label: "Liability summary", prompt: "Summarize the liability coverage." },
  { label: "Water damage", prompt: "Does this policy cover water or flood damage?" },
  { label: "Claim deadlines", prompt: "What are the claim filing deadlines?" },
  { label: "Deductibles", prompt: "What is the deductible for this policy?" },
  { label: "Cancellation", prompt: "Explain the cancellation and refund terms." },
];

export const MOCK_CITATIONS: Citation[] = [
  {
    id: "c1",
    documentId: "doc_02",
    documentName: "Homeowners-Policy-Allstate.pdf",
    page: 12,
    section: "Section II — Property Coverage",
    snippet:
      "Coverage applies to direct physical loss to property, excluding losses caused by flood, surface water, or water that backs up through sewers or drains unless an endorsement is attached.",
    relevanceScore: 0.94,
  },
  {
    id: "c2",
    documentId: "doc_02",
    documentName: "Homeowners-Policy-Allstate.pdf",
    page: 27,
    section: "Endorsement HO-32 — Water Backup",
    snippet:
      "Subject to a $5,000 sub-limit, this endorsement extends coverage to water that backs up through sewers or drains, but does not include flood as defined in Section I.",
    relevanceScore: 0.81,
  },
  {
    id: "c3",
    documentId: "doc_01",
    documentName: "Auto-Policy-Hartford-2024.pdf",
    page: 8,
    section: "Part D — Deductibles",
    snippet:
      "The collision deductible is $500 per occurrence. The comprehensive deductible is $250 per occurrence and applies separately to each covered loss.",
    relevanceScore: 0.88,
  },
];

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_1",
    title: "Flood coverage on Allstate HO policy",
    createdAt: "2025-05-12T15:00:00Z",
    updatedAt: "2025-05-12T15:08:00Z",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Does this policy cover flood damage?",
        timestamp: "2025-05-12T15:00:00Z",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "**Flood damage is excluded** under the base Homeowners policy. Coverage applies only to direct physical loss to property, and explicitly excludes flood, surface water, and water backup unless an endorsement is attached.\n\nEndorsement **HO-32 (Water Backup)** is attached on this policy and extends limited coverage for water backing up through sewers or drains, subject to a **$5,000 sub-limit**. True flood (rising surface water) remains excluded and would require a separate NFIP or private flood policy.",
        timestamp: "2025-05-12T15:00:08Z",
        confidence: "high",
        citations: [MOCK_CITATIONS[0], MOCK_CITATIONS[1]],
      },
    ],
  },
  {
    id: "conv_2",
    title: "Auto deductibles — Hartford",
    createdAt: "2025-05-10T09:30:00Z",
    updatedAt: "2025-05-10T09:32:00Z",
    messages: [],
  },
  {
    id: "conv_3",
    title: "Commercial liability exclusions",
    createdAt: "2025-05-08T11:00:00Z",
    updatedAt: "2025-05-08T11:14:00Z",
    messages: [],
  },
];
