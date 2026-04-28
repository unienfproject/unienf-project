import type { FrequenciaTurmaSummary } from "@/app/_lib/actions/frequencias";

function formatPercent(value: number | null) {
  return value === null ? "-" : `${value}%`;
}

function badgeClass(value: number | null) {
  if (value === null) return "bg-slate-100 text-slate-700";
  if (value >= 75) return "bg-green-100 text-green-800";
  if (value >= 60) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

export default function FrequenciaTable({
  frequencias,
}: {
  frequencias: FrequenciaTurmaSummary[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-slate-900">
        Frequência
      </h3>
      {frequencias.length === 0 ? (
        <p className="text-sm text-slate-500">
          Não existem dados de frequência para serem mostrados ainda.
        </p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Turma</th>
                <th className="p-2 text-center">Aulas</th>
                <th className="p-2 text-center">Presenças</th>
                <th className="p-2 text-center">Faltas</th>
                <th className="p-2 text-center">Frequência</th>
              </tr>
            </thead>
            <tbody>
              {frequencias.map((frequencia) => (
                <tr key={frequencia.turmaId} className="border-b">
                  <td className="p-2">
                    <div>
                      <p className="font-medium">{frequencia.turmaName}</p>
                      <p className="text-xs text-slate-600">
                        {frequencia.disciplinaName}
                      </p>
                    </div>
                  </td>
                  <td className="p-2 text-center">{frequencia.totalAulas}</td>
                  <td className="p-2 text-center">
                    {frequencia.totalPresencas}
                  </td>
                  <td className="p-2 text-center">{frequencia.totalFaltas}</td>
                  <td className="p-2 text-center">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${badgeClass(
                        frequencia.percentualPresenca,
                      )}`}
                    >
                      {formatPercent(frequencia.percentualPresenca)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
