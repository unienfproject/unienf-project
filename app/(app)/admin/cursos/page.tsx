import CursosPageClient from "@/app/_components/admin/CursosPageClient";
import { listCursos } from "@/app/_lib/actions/cursos";

export default async function Cursos() {
  let cursos: Awaited<ReturnType<typeof listCursos>> = [];

  try {
    cursos = await listCursos();
  } catch {
    cursos = [];
  }

  return <CursosPageClient cursos={cursos} />;
}
