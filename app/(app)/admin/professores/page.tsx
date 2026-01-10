"use client";

import CreateProfessorDialog from "@/app/_components/admin/CreateProfessorDialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { listProfessores, ProfessorRow } from "@/app/_lib/actions/professores";
import {
  EllipsisVertical,
  Eye,
  Funnel,
  Pencil,
  UserPlus,
  UserSearch,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Professores() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [professores, setProfessores] = useState<ProfessorRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loaging, setLoading] = useState(false);
  const router = useRouter();

  const PAGE_SIZE = 10;

  async function loadData(newPage:number){
    setLoading(true);

  //   const res = await listProfilePaginated({
  //     page: newPage,
  //     pageSize: PAGE_SIZE,
  //   });
  //   setProfessores(res.professores);
  //   setTotal(res.total);
  //   setPage(newPage);
  //   setLoading(false);
  // }

  // useEffect{() => {
  //   loadData(1);
  // }, []};
  useEffect(() => {
    listProfessores().then(setProfessores);
  }, []);

  const filteredProfessores = useMemo(() => {
    if (!searchTerm.trim()) return professores;

  const term = searchTerm.toLowerCase().trim();
  return professores.filter((professor) => {
    const nome = professor.name?.toLowerCase() ?? "";
    const email = professor.email?.toLowerCase() ?? "";
    const tel = professor.telefone?.toLowerCase() ?? "";
    return nome.includes(term) || email.includes(term) || tel.includes(term);
  });
}, [professores, searchTerm]);

  return (
    <div className="flex flex-col">
      <CreateProfessorDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <main className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                Professores
              </h1>
              <p className="text-muted-foreground">
                Gerencie todos os professores cadastrados
              </p>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <UserPlus />
              Novo Professor/Instrutor
            </Button>
          </div>
          <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <UserSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Buscar por nome ou email..."
                />
              </div>
            </div>
          </div>
          <div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Nome
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      CPF
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Telefone
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-right text-sm font-medium">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessores.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-muted-foreground px-6 py-4 text-center"
                      >
                        {searchTerm
                          ? "Nenhum professor encontrado com o termo pesquisado."
                          : "Nenhum professor encontrado."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProfessores.map((prof) => {
                      const initials = prof.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <TableRow
                          key={prof.id}
                          className="border-border/50 hover:bg-muted/20 bg-background border-b transition-colors last:border-0"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                <span className="text-primary text-sm font-semibold">
                                  {initials}
                                </span>
                              </div>
                              <div>
                                <p className="text-foreground text-sm font-medium">
                                  {prof.name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {prof.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground px-6 py-4 text-sm">
                            {prof.telefone}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                aria-label="Ações do Professor"
                              >
                                <EllipsisVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  router.push(`/admin/professores/${professores}`) 
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver perfil
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  // TODO: abrir modal de edição com o aluno
                                  // openEditModal(aluno)
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="border-border/50 flex items-center justify-between border-t px-6 py-4">
              <p className="text-muted-foreground text-sm">
                Mostrando {filteredProfessores.length} de {professores.length}{" "}
                Professores
              </p>
              <div className="flex items-center gap-2">
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-primary hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                variant="outline"
                // disable={page === 1 || loading}
                onClick={() => loadData(page - 1)}
                >
                  Anterior
                </Button>
                <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border-input bg-primary hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
