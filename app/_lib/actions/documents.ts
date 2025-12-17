export type DocumentStatus = "pending" | "delivered";

export type DocumentItem = {
  id: string;
  documentTypeId: string;
  title: string;
  required: boolean;
  status: DocumentStatus;
  notes?: string | null;
  updatedAt: string; // ISO
};
