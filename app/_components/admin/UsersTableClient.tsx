"use client";

import EditRoleButton from "@/app/_components/admin/EditRoleButton";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { usePaginatedData } from "@/app/_hooks/usePaginatedData";
import { listUsersPaginated } from "@/app/_lib/actions/users";
import { UserSearch } from "lucide-react";

const PAGE_SIZE = 10;

export default function UsersTableClient() {
  const {
    items: users,
    total,
    page,
    totalPages,
    loading,
    search,
    setSearch,
    prev,
    next,
  } = usePaginatedData(listUsersPaginated, PAGE_SIZE);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Usuários cadastrados
        </h2>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <UserSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
              placeholder="Buscar por nome, e-mail ou telefone..."
            />
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <Table className="w-full min-w-[900px] text-sm">
          <TableHeader className="border-b bg-slate-50">
            <TableRow>
              <TableHead className="p-3 text-left font-semibold text-slate-700">
                Nome
              </TableHead>
              <TableHead className="p-3 text-left font-semibold text-slate-700">
                E-mail
              </TableHead>
              <TableHead className="p-3 text-left font-semibold text-slate-700">
                Telefone
              </TableHead>
              <TableHead className="p-3 text-left font-semibold text-slate-700">
                Função
              </TableHead>
              <TableHead className="p-3 text-left font-semibold text-slate-700">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-6 text-center text-slate-500"
                >
                  Carregando usuários...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-6 text-center text-slate-500"
                >
                  Nenhum usuário encontrado (ou sem permissão).
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const safeName = u.name?.trim() || "-";
                const safeRole = u.role || "administrativo"; // ou "-" se você preferir não assumir
                return (
                  <TableRow key={u.id} className="border-b last:border-b-0">
                    <TableCell className="p-3 font-medium text-slate-900">
                      {safeName}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      {u.email || "-"}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      {u.telefone || "-"}
                    </TableCell>
                    <TableCell className="p-3 text-slate-700">
                      <span className="capitalize">{u.role || "-"}</span>
                    </TableCell>
                    <TableCell className="p-3">
                      <EditRoleButton
                        userId={u.id}
                        currentRole={safeRole}
                        userName={safeName}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t px-6 py-4">
        <p className="text-sm text-slate-500">
          Mostrando {users.length} de {total} usuários
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={prev}
            disabled={page === 1 || loading}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={next}
            disabled={page === totalPages || loading}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
