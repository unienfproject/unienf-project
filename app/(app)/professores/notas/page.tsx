import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
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
import { Bell, Save, Search } from "lucide-react";
export default function Notas() {
  return (
    <div className="flex-1">
      <header className="bg-card border-border flex h-16 items-center justify-between border-b px-6">
        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="text"
              className="border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground bg-muted/50 focus-visible:ring-primary flex h-10 w-full rounded-md border-0 px-3 py-2 pl-10 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Buscar..."
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground relative inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
            <Bell className="text-muted-foreground h-5 w-5" />
            <span className="bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full"></span>
          </Button>
          <div className="border-border flex items-center gap-3 border-l pl-4">
            <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-full">
              <span className="text-primary-foreground text-sm font-semibold">
                P
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-foreground text-sm font-medium">
                Prof. Ana Costa
              </p>
              <p className="text-muted-foreground text-xs">Professor</p>
            </div>
          </div>
        </div>
      </header>
      <main className="p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-foreground text-2xl font-bold">Lançar Notas</h1>
            <p className="text-muted-foreground">
              Selecione a turma e a avaliação para lançar as notas
            </p>
          </div>
          <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Turma
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Técnico 2024.1 - Anatomia</SelectItem>
                    <SelectItem value="2">
                      Técnico 2024.1 - Farmacologia
                    </SelectItem>
                    <SelectItem value="3">
                      Auxiliar 2024.1 - Biossegurança
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a avaliação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trabalho1">Trabalho 1</SelectItem>
                    <SelectItem value="prova2">Prova 2</SelectItem>
                    <SelectItem value="trabalho2">Trabalho 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="bg-card border-border/50 shadow-soft overflow-hidden rounded-2xl border">
            <div className="border-border border-b p-6">
              <h3 className="text-foreground text-lg font-semibold">
                Técnico 2024.1 - Anatomia - Prova 1
              </h3>
            </div>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Aluno
                    </TableHead>
                    <TableHead className="text-muted-foreground px-6 py-4 text-left text-sm font-medium">
                      Matrícula
                    </TableHead>
                    <TableHead className="text-muted-foreground w-32 px-6 py-4 text-center text-sm font-medium">
                      Nota (0-10)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border/50 bg-background border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <span className="text-primary text-sm font-semibold">
                            M
                          </span>
                        </div>
                        <span className="text-foreground text-sm font-medium">
                          Maria Silva
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                      2024001
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        type="number"
                        className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0.0"
                        value=""
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-muted/10 border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <span className="text-primary text-sm font-semibold">
                            J
                          </span>
                        </div>
                        <span className="text-foreground text-sm font-medium">
                          João Santos
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                      2024002
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        type="number"
                        className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0.0"
                        value=""
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-background border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <span className="text-primary text-sm font-semibold">
                            A
                          </span>
                        </div>
                        <span className="text-foreground text-sm font-medium">
                          Ana Costa
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                      2024003
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        type="number"
                        className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0.0"
                        value=""
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-muted/10 border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <span className="text-primary text-sm font-semibold">
                            C
                          </span>
                        </div>
                        <span className="text-foreground text-sm font-medium">
                          Carlos Oliveira
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                      2024004
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        type="number"
                        className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0.0"
                        value=""
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-background border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <span className="text-primary text-sm font-semibold">
                            F
                          </span>
                        </div>
                        <span className="text-foreground text-sm font-medium">
                          Fernanda Lima
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                      2024005
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        type="number"
                        className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0.0"
                        value=""
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-muted/10 border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <span className="text-primary text-sm font-semibold">
                            R
                          </span>
                        </div>
                        <span className="text-foreground text-sm font-medium">
                          Ricardo Souza
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                      2024006
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        type="number"
                        className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0.0"
                        value=""
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-background border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <span className="text-primary text-sm font-semibold">
                            J
                          </span>
                        </div>
                        <span className="text-foreground text-sm font-medium">
                          Juliana Pereira
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                      2024007
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        type="number"
                        className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0.0"
                        value=""
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-border/50 bg-muted/10 border-b last:border-0">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <span className="text-primary text-sm font-semibold">
                            P
                          </span>
                        </div>
                        <span className="text-foreground text-sm font-medium">
                          Pedro Mendes
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                      2024008
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        type="number"
                        className="border-input bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring mx-auto flex h-10 w-24 rounded-md border px-3 py-2 text-center text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0.0"
                        value=""
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="border-border bg-muted/20 flex items-center justify-between border-t p-6">
              <p className="text-muted-foreground text-sm">
                0 de 8 notas preenchidas
              </p>
              <Button className="ring-offset-background focus-visible:ring-ring [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap shadow-sm transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                <Save className="mr-2 h-4 w-4" />
                Salvar Notas
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
