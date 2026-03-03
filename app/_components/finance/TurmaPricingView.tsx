import { revalidatePath } from "next/cache";
import {
  listTurmasForPricingPicker,
  listTurmasPrecos,
  syncMensalidadesForTurma,
  upsertTurmaPreco,
} from "@/app/_lib/actions/pricing";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";

type Props = {
  basePath: "/admin/precos" | "/recepcao/precos";
  canEdit: boolean;
};

export default async function TurmaPricingView({ basePath, canEdit }: Props) {
  const [turmas, precos] = await Promise.all([
    listTurmasForPricingPicker(),
    listTurmasPrecos(),
  ]);

  async function actionUpsert(formData: FormData) {
    "use server";

    const turmaId = String(formData.get("turmaId") ?? "").trim();
    const duracaoMeses = Number(formData.get("duracaoMeses") ?? 0);
    const valorMensalidade = Number(
      String(formData.get("valorMensalidade") ?? "0").replace(",", "."),
    );
    const diaVencimento = Number(formData.get("diaVencimento") ?? 10);
    const inicioCompetenciaRaw = String(formData.get("inicioCompetencia") ?? "").trim();

    await upsertTurmaPreco({
      turmaId,
      duracaoMeses,
      valorMensalidade,
      diaVencimento,
      inicioCompetencia: inicioCompetenciaRaw || null,
      ativo: true,
    });

    revalidatePath(basePath);
  }

  async function actionRegenerate(formData: FormData) {
    "use server";
    const turmaId = String(formData.get("turmaId") ?? "").trim();
    if (!turmaId) return;
    await syncMensalidadesForTurma(turmaId);
    revalidatePath(basePath);
  }

  return (
    <div className="flex flex-col p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Valores por Turma</h1>
          <p className="text-slate-600">
            Defina duração e mensalidade da turma. Ao vincular alunos, as
            parcelas são geradas automaticamente no financeiro.
          </p>
        </div>

        {canEdit ? (
          <form action={actionUpsert} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Turma
                </label>
                <select
                  name="turmaId"
                  className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
                  required
                >
                  <option value="">Selecione...</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Duração (meses)
                </label>
                <Input name="duracaoMeses" type="number" min={1} max={60} defaultValue={6} required />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Valor mensal
                </label>
                <Input
                  name="valorMensalidade"
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={150}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Dia vencimento
                </label>
                <Input
                  name="diaVencimento"
                  type="number"
                  min={1}
                  max={28}
                  defaultValue={10}
                  required
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Início da competência (opcional)
                </label>
                <Input name="inicioCompetencia" type="date" />
              </div>
              <div className="md:col-span-2 flex items-end">
                <Button type="submit">Salvar Valor da Turma</Button>
              </div>
            </div>
          </form>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b p-4">
            <h2 className="font-semibold text-slate-900">Turmas Precificadas</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="p-3 text-left font-semibold text-slate-700">Turma</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Curso</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Professor</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Duração</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Mensalidade</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Venc.</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Início</th>
                  <th className="p-3 text-left font-semibold text-slate-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {precos.map((row) => (
                  <tr key={row.id} className="border-b last:border-b-0">
                    <td className="p-3 font-medium text-slate-900">{row.turmaTag}</td>
                    <td className="p-3 text-slate-700">{row.disciplinaName ?? "-"}</td>
                    <td className="p-3 text-slate-700">{row.professorName ?? "-"}</td>
                    <td className="p-3 text-slate-700">{row.duracaoMeses} meses</td>
                    <td className="p-3 text-slate-700">
                      {row.valorMensalidade.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="p-3 text-slate-700">Dia {row.diaVencimento}</td>
                    <td className="p-3 text-slate-700">{row.inicioCompetencia ?? "-"}</td>
                    <td className="p-3">
                      <form action={actionRegenerate}>
                        <input type="hidden" name="turmaId" value={row.turmaId} />
                        <Button type="submit" variant="outline">
                          Regenerar Parcelas
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}

                {precos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500">
                      Nenhum valor cadastrado.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
