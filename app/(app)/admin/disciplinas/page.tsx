"use client";

import { useEffect, useState } from "react";
import {
  createDisciplina,
  deleteDisciplina,
  listDisciplinas,
  updateDisciplina,
} from "@/app/_lib/actions/disciplinas";
import { notifyDataChanged } from "@/app/_lib/client/dataRefresh";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";

import { EllipsisVertical, Pencil, Plus, Trash2, Info } from "lucide-react";

type Disciplina = {
  id: string;
  name: string;
  conteudo: string | null;
  created_at: string;
};

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const [editing, setEditing] = useState<Disciplina | null>(null);
  const [selectedDisciplina, setSelectedDisciplina] =
    useState<Disciplina | null>(null);

  const [name, setName] = useState("");
  const [conteudo, setConteudo] = useState("");

  async function load() {
    setLoading(true);
    const data = await listDisciplinas();
    setDisciplinas(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setName("");
    setConteudo("");
    setModalOpen(true);
  }

  function openEdit(d: Disciplina) {
    setEditing(d);
    setName(d.name);
    setConteudo(d.conteudo ?? "");
    setModalOpen(true);
  }

  async function handleSave() {
    if (!name || !conteudo) return;

    if (editing) {
      await updateDisciplina({
        disciplinaId: editing.id,
        name,
        conteudo,
      });
    } else {
      await createDisciplina({ name, conteudo });
    }

    setModalOpen(false);
    await load();
    notifyDataChanged();
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta disciplina?")) return;
    await deleteDisciplina(id);
    await load();
    notifyDataChanged();
  }

  function openInfo(disciplina: Disciplina) {
    setSelectedDisciplina(disciplina);
    setInfoOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Conteúdos</h1>
          <p className="text-muted-foreground">
            Gerencie conteúdos reutilizáveis nas turmas
          </p>
        </div>

        <Button onClick={openCreate} className="flex gap-2">
          <Plus className="h-4 w-4" />
          Novo Conteúdo
        </Button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Criada em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : disciplinas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  Nenhum conteúdo cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              disciplinas.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>
                    {new Date(d.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openEdit(d)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openInfo(d)}
                        >
                          <Info className="mr-2 h-4 w-4" />
                          Informações
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={() => handleDelete(d.id)}
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Conteúdo" : "Novo conteúdo"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Nome do conteúdo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Textarea
              placeholder="Conteúdo"
              rows={6}
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
            />

            <Button onClick={handleSave}>
              {editing ? "Salvar alterações" : "Criar Conteúdo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={infoOpen}
        onOpenChange={(open) => {
          setInfoOpen(open);
          if (!open) setSelectedDisciplina(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Informações da disciplina</DialogTitle>
          </DialogHeader>

          {!selectedDisciplina ? null : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Nome</p>
                <p className="text-muted-foreground">{selectedDisciplina.name}</p>
              </div>

              <div>
                <p className="font-medium">Conteúdo</p>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedDisciplina.conteudo || "Não informado."}
                </p>
              </div>

              <div>
                <p className="font-medium">Data de criação</p>
                <p className="text-muted-foreground">
                  {new Date(selectedDisciplina.created_at).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
