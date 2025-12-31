export type DocumentStatus = "pending" | "delivered" | "rejected";

export type DocumentItem = {
  id: string;
  documentTypeId: string;
  title: string;
  required: boolean;
  status: DocumentStatus;
  notes?: string | null;
  updatedAt: string; // ISO
};
