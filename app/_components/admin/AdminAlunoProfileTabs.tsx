"use client";

import DocumentsView from "@/app/_components/documents/DocumentsView";
import FinanceiroAlunoView from "@/app/_components/recepcao/FinanceiroAlunoView";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import type { AlunoProfileData } from "@/app/_lib/actions/alunos";
import type { DocumentItem } from "@/app/_lib/actions/documents";
import type { MensalidadeRow } from "@/app/_lib/actions/mensalidades";
import type { NotasByTurmaForStaff } from "@/app/_lib/actions/notas";
import { BookOpen, Calendar, Mail, Phone, User } from "lucide-react";

type Props = {
  alunoData: AlunoProfileData;
  docs: DocumentItem[];
  mensalidades: MensalidadeRow[];
  notas: NotasByTurmaForStaff[];
  studentId: string;
};

export default function AdminAlunoProfileTabs({
  alunoData,
  docs,
  mensalidades,
  notas,
  studentId,
}: Props) {
  return (
    <Tabs defaultValue="dados-pessoais" className="w-full">
      <TabsList className=" grid w-full grid-cols-5">
        <TabsTrigger className="cursor-pointer" value="dados-pessoais">Dados Pessoais</TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="academico">Acadêmico</TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="documentos">Documentos</TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="status-documentos">Status Documentos</TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="financeiro">Financeiro</TabsTrigger>
      </TabsList>

      <TabsContent value="dados-pessoais" className="mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Dados Pessoais
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="mt-1 h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-600">Nome</p>
                <p className="text-sm font-medium text-slate-900">
                  {alunoData.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-600">Email</p>
                <p className="text-sm font-medium text-slate-900">
                  {alunoData.email}
                </p>
              </div>
            </div>

            {alunoData.telefone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-600">Telefone</p>
                  <p className="text-sm font-medium text-slate-900">
                    {alunoData.telefone}
                  </p>
                </div>
              </div>
            )}

            {alunoData.age !== null && (
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-600">
                    Idade / Data de Nascimento
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {alunoData.age} anos
                    {alunoData.dateOfBirth &&
                      ` (${new Date(alunoData.dateOfBirth).toLocaleDateString("pt-BR")})`}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-600">
                  Cadastrado em
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {new Date(alunoData.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="academico" className="mt-6">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Turmas
            </h3>
            {alunoData.turmas.length === 0 ? (
              <p className="text-sm text-slate-500">
                Aluno não está vinculado a nenhuma turma.
              </p>
            ) : (
              <div className="space-y-3">
                {alunoData.turmas.map((turma) => (
                  <div
                    key={turma.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <BookOpen className="h-5 w-5 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {turma.name}
                      </p>
                      <p className="text-xs text-slate-600">
                        {turma.disciplinaName || "Sem disciplina"} • {turma.tag}
                        {turma.status && ` • ${turma.status}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Notas
            </h3>
            {notas.length === 0 ? (
              <p className="text-sm text-slate-500">
                Não existem dados para serem mostrados ainda.
              </p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Turma</th>
                      <th className="p-2 text-center">A1</th>
                      <th className="p-2 text-center">A2</th>
                      <th className="p-2 text-center">A3</th>
                      <th className="p-2 text-center">REC</th>
                      <th className="p-2 text-center">Média</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notas.map((nota) => (
                      <tr key={nota.turmaId} className="border-b">
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{nota.turmaName}</p>
                            <p className="text-xs text-slate-600">
                              {nota.disciplinaName}
                            </p>
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          {nota.a1 !== null ? nota.a1.toFixed(1) : "-"}
                        </td>
                        <td className="p-2 text-center">
                          {nota.a2 !== null ? nota.a2.toFixed(1) : "-"}
                        </td>
                        <td className="p-2 text-center">
                          {nota.a3 !== null ? nota.a3.toFixed(1) : "-"}
                        </td>
                        <td className="p-2 text-center">
                          {nota.rec !== null ? nota.rec.toFixed(1) : "-"}
                        </td>
                        <td className="p-2 text-center font-medium">
                          {nota.media !== null ? nota.media.toFixed(1) : "-"}
                        </td>
                        <td className="p-2 text-center">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              nota.status === "aprovado"
                                ? "bg-green-100 text-green-800"
                                : nota.status === "reprovado"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {nota.status === "aprovado"
                              ? "Aprovado"
                              : nota.status === "reprovado"
                                ? "Reprovado"
                                : "Em andamento"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="documentos" className="mt-6">
        <DocumentsView
          title="Documentos do Aluno"
          subtitle="Gerencie os documentos do aluno, marque como entregue e registre observações."
          canEdit={true}
          docs={docs}
        />
      </TabsContent>

      <TabsContent value="status-documentos" className="mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Status dos Documentos
          </h3>
          {docs.length === 0 ? (
            <p className="text-sm text-slate-500">
              Não existem documentos cadastrados para este aluno.
            </p>
          ) : (
            <div className="space-y-4">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {doc.documentTypeName}
                      {doc.required && (
                        <span className="ml-2 text-xs text-red-600">
                          (Obrigatório)
                        </span>
                      )}
                    </p>
                    {doc.notes && (
                      <p className="mt-1 text-xs text-slate-600">{doc.notes}</p>
                    )}
                  </div>
                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        doc.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : doc.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {doc.status === "delivered"
                        ? "Entregue"
                        : doc.status === "rejected"
                          ? "Rejeitado"
                          : "Pendente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="financeiro" className="mt-6">
        <FinanceiroAlunoView
          mensalidades={mensalidades}
          studentId={studentId}
        />
      </TabsContent>
    </Tabs>
  );
}
