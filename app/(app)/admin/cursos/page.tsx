"use client";

import { useEffect, useMemo, useState } from "react";
import {
  EllipsisVertical,
  FolderPlus,
  Eye,
  Pencil,
  Trash2,
  FolderSearch2,
} from "lucide-react";

import {
  listCursos,
  createCurso,
  updateCurso,
  deleteCurso,
  CursoRow,
} from "@/app/_lib/actions/cursos";

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
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Label } from "@/app/_components/ui/label";

export default function CursosPage() {
  const [cursos, setCursos] = useState<CursoRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selectedCurso, setSelectedCurso] = useState<CursoRow | null>(null);

  const [formName, setFormName] = useState("");
  const [formDuration, setFormDuration] = useState<number | "">("");

  async function loadCursos() {
    setLoading(true);
    try {
      const data = await listCursos();
      setCursos(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCursos();
  }, []);

  const filteredCursos = useMemo(() => {
    if (!search.trim()) return cursos;
    const term = search.toLowerCase();
    return cursos.filter((c) => c.name.toLowerCase().includes(term));
  }, [cursos, search]);

  function openCreate() {
    setFormName("");
    setFormDuration("");
    setCreateOpen(true);
  }

  function openInfo(curso: CursoRow) {
    setSelectedCurso(curso);
    setInfoOpen(true);
  }

  function openEdit(curso: CursoRow) {
    setSelectedCurso(curso);
    setFormName(curso.name);
    setFormDuration(curso.durationMonths ?? "");
    setEditOpen(true);
  }

  async function handleCreate() {
    await createCurso({
      name: formName,
      durationMonths: formDuration === "" ? null : Number(formDuration),
    });

    setCreateOpen(false);
    loadCursos();
  }

  async function handleEdit() {
    if (!selectedCurso) return;

    await updateCurso({
      id: selectedCurso.id,
      name: formName,
      durationMonths: formDuration === "" ? null : Number(formDuration),
    });

    setEditOpen(false);
    setSelectedCurso(null);
    loadCursos();
  }

  async function handleDelete(curso: CursoRow) {
    const confirm = window.confirm(
      `Deseja realmente excluir o curso "${curso.name}"?`,
    );
    if (!confirm) return;

    await deleteCurso({ id: curso.id });
    loadCursos();
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cursos</h1>
          <p className="text-muted-foreground">
            Gerencie os cursos cadastrados
          </p>
        </div>

        <Button onClick={openCreate} className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Novo Curso
        </Button>
      </div>

      <div className="relative max-w-full">
        <FolderSearch2 className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar curso..."
          className="pl-12"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Curso</TableHead>
              <TableHead>Duração (meses)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="py-6 text-center">
                  Carregando cursos...
                </TableCell>
              </TableRow>
            ) : filteredCursos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-6 text-center">
                  Nenhum curso encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredCursos.map((curso) => (
                <TableRow key={curso.id}>
                  <TableCell>{curso.name}</TableCell>
                  <TableCell>{curso.durationMonths ?? "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => openInfo(curso)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Informações
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => openEdit(curso)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(curso)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Curso</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome do curso</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div>
              <Label>Duração (meses)</Label>
              <Input
                type="number"
                value={formDuration}
                onChange={(e) =>
                  setFormDuration(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleCreate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informações do Curso</DialogTitle>
          </DialogHeader>

          {selectedCurso && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Nome:</strong> {selectedCurso.name}
              </p>
              <p>
                <strong>Duração:</strong> {selectedCurso.durationMonths ?? "-"}{" "}
                meses
              </p>
              <p>
                <strong>Criado em:</strong>{" "}
                {new Date(selectedCurso.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
          </DialogHeader>

          <div className="gap-2 space-y-4">
            <div className="gap-2">
              <Label>Nome do curso</Label>
              <Input
                className="mt-2"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="gap-2">
              <Label>Duração (meses)</Label>
              <Input
                className="mt-2"
                type="number"
                value={formDuration}
                onChange={(e) =>
                  setFormDuration(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button className="cursor-pointer" onClick={handleEdit}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
