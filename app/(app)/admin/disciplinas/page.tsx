import DisciplinaForm from "@/app/_components/disciplinas/DisciplinaForm";

export default function NovaDisciplinaPage() {
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">Nova Disciplina</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Cadastre uma disciplina para reutilização em diferentes turmas.
      </p>

      <DisciplinaForm />
    </div>
  );
}