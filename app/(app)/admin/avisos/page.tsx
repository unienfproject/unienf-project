// cspell:ignore avisos
import AvisosClient from "@/app/_components/admin/AvisosClient";
import { listAvisos } from "@/app/_lib/actions/avisos";

export default async function AvisosPage() {
  const avisos = await listAvisos().catch(() => []);

  return <AvisosClient initialAvisos={avisos} />;
}
