import { DocumentItem } from "@/app/_lib/actions/documents";

const mockDocsByStudent: Record<string, DocumentItem[]> = {
  "stu-001": [
    {
      id: "d1",
      documentTypeId: "rg",
      title: "RG (Identidade)",
      required: true,
      status: "delivered",
      notes: null,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "d2",
      documentTypeId: "cpf",
      title: "CPF",
      required: true,
      status: "delivered",
      notes: null,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "d3",
      documentTypeId: "hist",
      title: "Histórico Escolar",
      required: true,
      status: "pending",
      notes: "Entregar cópia autenticada.",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "d4",
      documentTypeId: "res",
      title: "Comprovante de Residência",
      required: true,
      status: "delivered",
      notes: null,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "d5",
      documentTypeId: "cert",
      title: "Certidão de Nascimento",
      required: true,
      status: "pending",
      notes: null,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "d6",
      documentTypeId: "foto",
      title: "Foto 3x4",
      required: true,
      status: "delivered",
      notes: null,
      updatedAt: new Date().toISOString(),
    },
  ],
};

export async function getStudentDocuments(
  studentId: string,
): Promise<DocumentItem[]> {
  return mockDocsByStudent[studentId] ?? [];
}

export async function updateStudentDocument(
  studentId: string,
  documentId: string,
  patch: Partial<Pick<DocumentItem, "status" | "notes">>,
): Promise<void> {
  const docs = mockDocsByStudent[studentId];
  if (!docs) return;

  const idx = docs.findIndex((d) => d.id === documentId);
  if (idx === -1) return;

  docs[idx] = {
    ...docs[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
}

export async function getPendingDocumentsGeneralized(): Promise<
  { studentId: string; studentName: string; pendingCount: number }[]
> {
  // Visão "GENERALIZADA" para administrativo: quantos pendentes por aluno
  return [
    { studentId: "stu-001", studentName: "Maria Silva", pendingCount: 2 },
    { studentId: "stu-002", studentName: "João Pereira", pendingCount: 1 },
  ];
}
