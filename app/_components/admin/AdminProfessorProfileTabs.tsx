"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import type { ProfessorProfileData } from "@/app/_lib/actions/professores";
import { BookOpen, Calendar, Mail, Phone, User } from "lucide-react";

type Props = {
  professorData: ProfessorProfileData;
};

export default function AdminProfessorProfileTabs({ professorData }: Props) {
  return (
    <Tabs defaultValue="dados-pessoais" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
        <TabsTrigger value="academico">Acadêmico</TabsTrigger>
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
                  {professorData.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-1 h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs font-medium text-slate-600">Email</p>
                <p className="text-sm font-medium text-slate-900">
                  {professorData.email}
                </p>
              </div>
            </div>

            {professorData.telefone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-600">Telefone</p>
                  <p className="text-sm font-medium text-slate-900">
                    {professorData.telefone}
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
                  {new Date(professorData.createdAt).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="academico" className="mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Turmas
          </h3>
          {professorData.turmas.length === 0 ? (
            <p className="text-sm text-slate-500">
              Professor não está vinculado a nenhuma turma.
            </p>
          ) : (
            <div className="space-y-3">
              {professorData.turmas.map((turma) => (
                <div
                  key={turma.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <BookOpen className="h-5 w-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {turma.tag}
                    </p>
                    <p className="text-xs text-slate-600">
                      {turma.disciplinaName || "Sem disciplina"}
                      {turma.status && ` • ${turma.status}`}
                      {` • ${turma.totalAlunos} aluno${turma.totalAlunos !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
