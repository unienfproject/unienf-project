import { TurmasPageContent } from "@/app/(app)/admin/turmas/page";

export default function RecepcaoTurmasPage() {
  return <TurmasPageContent basePath="/recepcao/turmas" canCreate={false} />;
}
