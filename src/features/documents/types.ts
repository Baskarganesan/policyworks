export type DocumentStatus = "uploaded" | "processing" | "indexed" | "failed";
export type PolicyType = "Auto" | "Home" | "Life" | "Health" | "Commercial" | "Umbrella";

export interface PolicyDocument {
  id: string;
  fileName: string;
  fileType: "pdf" | "docx";
  uploadDate: string; // ISO
  status: DocumentStatus;
  fileSize: number; // bytes
  policyType: PolicyType;
  uploadedBy?: string;
  pages?: number;
}

export const POLICY_TYPES: PolicyType[] = ["Auto", "Home", "Life", "Health", "Commercial", "Umbrella"];

export const MOCK_DOCUMENTS: PolicyDocument[] = [
  {
    id: "doc_01",
    fileName: "Auto-Policy-Hartford-2024.pdf",
    fileType: "pdf",
    uploadDate: "2025-04-22T14:21:00Z",
    status: "indexed",
    fileSize: 1_842_113,
    policyType: "Auto",
    uploadedBy: "Sarah Chen",
    pages: 32,
  },
  {
    id: "doc_02",
    fileName: "Homeowners-Policy-Allstate.pdf",
    fileType: "pdf",
    uploadDate: "2025-05-01T09:05:00Z",
    status: "indexed",
    fileSize: 2_540_882,
    policyType: "Home",
    uploadedBy: "Marcus Hill",
    pages: 48,
  },
  {
    id: "doc_03",
    fileName: "Commercial-Liability-Endorsement.docx",
    fileType: "docx",
    uploadDate: "2025-05-08T11:42:00Z",
    status: "processing",
    fileSize: 412_004,
    policyType: "Commercial",
    uploadedBy: "Priya Natarajan",
    pages: 9,
  },
  {
    id: "doc_04",
    fileName: "Umbrella-Policy-Travelers-2025.pdf",
    fileType: "pdf",
    uploadDate: "2025-05-10T16:00:00Z",
    status: "uploaded",
    fileSize: 980_223,
    policyType: "Umbrella",
    uploadedBy: "Sarah Chen",
    pages: 14,
  },
  {
    id: "doc_05",
    fileName: "Life-Policy-Prudential-Q2.pdf",
    fileType: "pdf",
    uploadDate: "2025-05-11T08:13:00Z",
    status: "failed",
    fileSize: 3_212_874,
    policyType: "Life",
    uploadedBy: "Marcus Hill",
    pages: 56,
  },
  {
    id: "doc_06",
    fileName: "Group-Health-Plan-Aetna.pdf",
    fileType: "pdf",
    uploadDate: "2025-05-12T13:24:00Z",
    status: "indexed",
    fileSize: 4_103_998,
    policyType: "Health",
    uploadedBy: "Priya Natarajan",
    pages: 72,
  },
];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
