"use client";

import EtiquetasView from "@/app/_components/aluno/EtiquetasView";
import ObservacoesPedagogicasView from "@/app/_components/aluno/ObservacoesPedagogicasView";
import DocumentsView from "@/app/_components/documents/DocumentsView";
import EditDadosPessoais from "@/app/_components/recepcao/EditDadosPessoais";
import FinanceiroAlunoView from "@/app/_components/recepcao/FinanceiroAlunoView";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import type { AlunoProfileData } from "@/app/_lib/actions/alunos";
import type { AvisoForStudent } from "@/app/_lib/actions/avisos";
import type { DocumentItem } from "@/app/_lib/actions/documents";
import type { MensalidadeRow } from "@/app/_lib/actions/mensalidades";
import type { NotasByTurmaForStaff } from "@/app/_lib/actions/notas";
import { BookOpen, Calendar, Mail, User } from "lucide-react";

type Props = {
  alunoData: AlunoProfileData;
  docs: DocumentItem[];
  mensalidades: MensalidadeRow[];
  avisos: AvisoForStudent[];
  notas: NotasByTurmaForStaff[];
  studentId: string;
};

export default function AlunoProfileTabs({
  alunoData,
  docs,
  mensalidades,
  avisos,
  notas,
  studentId,
}: Props) {
  return (
    <Tabs defaultValue="visao-geral" className="w-full">
      <TabsList className="grid w-full grid-cols-8">
        <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
        <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
        <TabsTrigger value="academico">Acadêmico</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
        <TabsTrigger value="avisos">Avisos</TabsTrigger>
        <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        <TabsTrigger value="etiquetas">Etiquetas</TabsTrigger>
        <TabsTrigger value="observacoes">Observações</TabsTrigger>
      </TabsList>

      <TabsContent value="visao-geral" className="mt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Informações Básicas
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
                  <User className="mt-1 h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs font-medium text-slate-600">
                      Telefone
                    </p>
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
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Resumo
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Turmas Ativas</span>
                <span className="text-sm font-medium text-slate-900">
                  {alunoData.turmas.filter((t) => t.status === "ativa").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Documentos Pendentes
                </span>
                <span className="text-sm font-medium text-slate-900">
                  {docs.filter((d) => d.status === "pending").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Mensalidades Pendentes
                </span>
                <span className="text-sm font-medium text-slate-900">
                  {mensalidades.filter((m) => m.status === "pendente").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Avisos</span>
                <span className="text-sm font-medium text-slate-900">
                  {avisos.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="dados-pessoais" className="mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Dados Pessoais
          </h3>
          <EditDadosPessoais
            studentId={studentId}
            initialName={alunoData.name}
            initialTelefone={alunoData.telefone}
          />
          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-600">Email</p>
                <p className="text-sm font-medium text-slate-900">
                  {alunoData.email}
                </p>
              </div>
            </div>

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
                Não existem dados para serem mostrados ainda.
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

      <TabsContent value="avisos" className="mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Avisos e Histórico
          </h3>
          {avisos.length === 0 ? (
            <p className="text-sm text-slate-500">
              Não existem dados para serem mostrados ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {avisos.map((aviso) => (
                <div
                  key={aviso.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-900">
                        {aviso.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-600">
                        {aviso.authorName || "Desconhecido"}
                        {aviso.authorRole && ` • ${aviso.authorRole}`}
                        {aviso.turmaName && ` • ${aviso.turmaName}`}
                        {" • "}
                        {new Date(aviso.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="mt-2 text-sm whitespace-pre-line text-slate-700">
                        {aviso.message}
                      </p>
                    </div>
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

      <TabsContent value="etiquetas" className="mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Etiquetas
          </h3>
          <EtiquetasView studentId={studentId} canEdit={true} />
        </div>
      </TabsContent>

      <TabsContent value="observacoes" className="mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Observações Pedagógicas
          </h3>
          <p className="mb-4 text-sm text-slate-600">
            Apenas visualização. Para criar ou editar observações, entre em
            contato com a coordenação.
          </p>
          <ObservacoesPedagogicasView studentId={studentId} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
