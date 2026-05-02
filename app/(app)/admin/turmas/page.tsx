"use client";

import CreateTurmaDialog from "@/app/_components/admin/CreateTurmaDialog";
import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import {
  EllipsisVertical,
  Eye,
  FolderPlus,
  FolderSearch2,
  Pencil,
  Save,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePaginatedData } from "@/app/_hooks/usePaginatedData";
import {
  listTurmasPaginated,
  updateTurmaAdmin,
  type TurmaRow,
} from "@/app/_lib/actions/turmas";
import { listSubjectsForPicker } from "@/app/_lib/actions/classes";
import { notifyDataChanged } from "@/app/_lib/client/dataRefresh";
import { toast } from "sonner";

const PAGE_SIZE = 10;
type PickerItem = { id: string; label: string; description?: string | null };
type EditForm = {
  tag: string;
  period: string;
  startDate: string;
  endDate: string;
  disciplinaId: string;
};

export function TurmasPageContent({
  basePath = "/admin/turmas",
  canCreate = true,
  canEdit = true,
}: {
  basePath?: string;
  canCreate?: boolean;
  canEdit?: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<TurmaRow | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    tag: "",
    period: "",
    startDate: "",
    endDate: "",
    disciplinaId: "",
  });
  const [disciplinas, setDisciplinas] = useState<PickerItem[]>([]);
  const [loadingDisciplinas, setLoadingDisciplinas] = useState(false);
  const [pending, startTransition] = useTransition();
  const editPanelRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const {
    items: turmas,
    total,
    page,
    totalPages,
    loading,
    search,
    setSearch,
    prev,
    next,
    reload,
  } = usePaginatedData(listTurmasPaginated, PAGE_SIZE);

  const generatedTag = useMemo(() => {
    if (!editingTurma) return "";

    const disciplinaNome =
      disciplinas.find((d) => d.id === editForm.disciplinaId)?.label ??
      editingTurma.disciplinaName ??
      "";
    const professorNome = editingTurma.professorName ?? "";
    const inicio = editForm.startDate;
    const termino = editForm.endDate || editForm.startDate;

    if (!disciplinaNome || !professorNome || !inicio || !termino) return "";
    return `${disciplinaNome} - ${professorNome} - ${inicio} - ${termino}`;
  }, [
    disciplinas,
    editForm.disciplinaId,
    editForm.endDate,
    editForm.startDate,
    editingTurma,
  ]);

  useEffect(() => {
    if (editingTurma && generatedTag) {
      setEditForm((current) => ({ ...current, tag: generatedTag }));
    }
  }, [editingTurma, generatedTag]);

  async function ensureDisciplinasLoaded() {
    if (disciplinas.length > 0 || loadingDisciplinas) return;

    setLoadingDisciplinas(true);
    try {
      const rows = await listSubjectsForPicker();
      setDisciplinas(rows);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao carregar disciplinas.",
      );
    } finally {
      setLoadingDisciplinas(false);
    }
  }

  function openEdit(turma: TurmaRow) {
    setEditingTurma(turma);
    setEditForm({
      tag: turma.tag,
      period: turma.period,
      startDate: turma.startDate,
      endDate: turma.endDate,
      disciplinaId: turma.disciplinaId ?? "",
    });
    void ensureDisciplinasLoaded();
    window.setTimeout(() => {
      editPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  }

  function closeEdit() {
    setEditingTurma(null);
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingTurma) return;

    startTransition(async () => {
      try {
        await updateTurmaAdmin({
          turmaId: editingTurma.id,
          tag: editForm.tag,
          period: editForm.period,
          startDate: editForm.startDate,
          endDate: editForm.endDate || editForm.startDate,
          disciplinaId: editForm.disciplinaId,
        });

        toast.success("Turma atualizada com sucesso!");
        closeEdit();
        notifyDataChanged(router);
        await reload();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao atualizar turma.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col">
      {canCreate ? (
        <CreateTurmaDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      ) : null}

      <main className="flex flex-1 flex-col">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                Disciplinas Cadastradas
              </h1>
              <p className="text-muted-foreground">
                Gerencie todas as disciplinas cadastradas
              </p>
            </div>

            {canCreate ? (
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <FolderPlus />
                Nova Disciplina
              </Button>
            ) : null}
          </div>

          <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <FolderSearch2 className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12"
                  placeholder="Buscar por disciplina, professor ou etiqueta..."
                />
              </div>
            </div>
          </div>

          {editingTurma ? (
            <section
              ref={editPanelRef}
              className="mx-auto w-full max-w-4xl rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"
            >
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      Editar turma
                    </h2>
                    <p className="text-sm text-slate-600">
                      Altere apenas as informações vinculadas a esta turma.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={closeEdit}
                    aria-label="Fechar edição"
                    disabled={pending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="turma-tag">Nome da turma</Label>
                    <Input
                      id="turma-tag"
                      value={editForm.tag}
                      onChange={(event) => {
                        setEditForm({ ...editForm, tag: event.target.value });
                      }}
                      placeholder="Nome da turma"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="turma-period">Período</Label>
                    <Input
                      id="turma-period"
                      value={editForm.period}
                      onChange={(event) =>
                        setEditForm({ ...editForm, period: event.target.value })
                      }
                      placeholder="Ex.: 2026.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Disciplina vinculada</Label>
                    <Select
                      value={editForm.disciplinaId}
                      onValueChange={(value) =>
                        setEditForm({ ...editForm, disciplinaId: value })
                      }
                      disabled={loadingDisciplinas || pending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {disciplinas.map((disciplina) => (
                          <SelectItem key={disciplina.id} value={disciplina.id}>
                            {disciplina.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="turma-start-date">Data de início</Label>
                    <Input
                      id="turma-start-date"
                      type="date"
                      value={editForm.startDate}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          startDate: event.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="turma-end-date">Data de término</Label>
                    <Input
                      id="turma-end-date"
                      type="date"
                      value={editForm.endDate}
                      onChange={(event) =>
                        setEditForm({ ...editForm, endDate: event.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Professor</Label>
                    <Input value={editingTurma.professorName ?? "-"} readOnly />
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeEdit}
                    disabled={pending}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={pending}>
                    <Save className="mr-2 h-4 w-4" />
                    {pending ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </form>
            </section>
          ) : null}

          <div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Turma
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Professor
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Disciplina
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-right text-sm font-medium">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-muted-foreground px-6 py-6 text-center"
                      >
                        Carregando Disciplinas...
                      </TableCell>
                    </TableRow>
                  ) : turmas.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-muted-foreground px-6 py-4 text-center"
                      >
                        {search
                          ? "Nenhuma turma encontrada com o termo pesquisado."
                          : "Nenhuma turma encontrada."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    turmas.map((turma) => {
                      const disciplina = turma.disciplinaName || "Disciplina";
                      const initials = disciplina
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <TableRow
                          key={turma.id}
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
                                  {disciplina}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-foreground px-6 py-4 text-sm">
                            {turma.professorName || "-"}
                          </TableCell>

                          <TableCell className="text-foreground px-6 py-4 text-sm">
                            {turma.tag || "-"}
                          </TableCell>

                          <TableCell className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-accent hover:text-accent-foreground inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg"
                                    aria-label="Ações da Turma"
                                  >
                                    <EllipsisVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                  align="end"
                                  className="w-44"
                                >
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      router.push(`${basePath}/${turma.id}`)
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Disciplina
                                  </DropdownMenuItem>

                                  {canEdit ? (
                                    <DropdownMenuItem
                                      className="cursor-pointer"
                                      onClick={() => openEdit(turma)}
                                    >
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Editar
                                    </DropdownMenuItem>
                                  ) : null}
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
                Mostrando {turmas.length} de {total} disciplinas
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
        </div>
      </main>
    </div>
  );
}

export default function Turmas() {
  return <TurmasPageContent />;
}
