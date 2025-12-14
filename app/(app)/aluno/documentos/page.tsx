import DocumentCard from "@/app/_components/aluno/DocumentCard";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Bell, Search } from "lucide-react";
import SideBar from "../Sidebar";

export default function Documentos() {
  return (
    <div>
      <SideBar />
      <div className="ml-64 flex-1">
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
                  M
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-foreground text-sm font-medium">
                  Maria Silva
                </p>
                <p className="text-muted-foreground text-xs">Aluno</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                Meus Documentos
              </h1>
              <p className="text-muted-foreground">
                Gerencie seus documentos acadêmicos
              </p>
            </div>
            <div className="bg-card border-border/50 shadow-soft rounded-2xl border p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-foreground text-lg font-semibold">
                    Progresso da Documentação
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    4 de 6 documentos aprovados
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-primary text-3xl font-bold">67%</span>
                </div>
              </div>
              <div className="bg-muted h-3 w-full rounded-full">
                <div className="bg-primary h-3 rounded-full transition-all duration-500"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DocumentCard
                title="RG (Identidade)"
                status="approved"
                fileName="rg_maria_silva.pdf"
                uploadDate="01/02/2024"
              />
              <DocumentCard
                title="CPF"
                status="approved"
                fileName="cpf_maria_silva.pdf"
                uploadDate="01/02/2024"
              />
              <DocumentCard title="Histórico Escolar" status="pending" />
              <DocumentCard
                title="Comprovante de Residência"
                status="approved"
                fileName="comprovante_residencia.pdf"
                uploadDate="05/02/2024"
              />
              <DocumentCard
                title="Certidão de Nascimento"
                status="rejected"
                errorMessage="Documento ilegível, favor enviar novamente."
              />
              <DocumentCard
                title="Foto 3x4"
                status="approved"
                fileName="foto_3x4.jpg"
                uploadDate="01/02/2024"
              />
            </div>
            <div className="bg-primary/5 border-primary/20 rounded-2xl border p-6">
              <h4 className="text-foreground mb-2 font-semibold">
                Informações Importantes
              </h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>• Os documentos devem estar em formato PDF, JPG ou PNG</li>
                <li>• Tamanho máximo por arquivo: 5MB</li>
                <li>• Certifique-se de que os documentos estão legíveis</li>
                <li>
                  • Documentos rejeitados devem ser reenviados em até 15 dias
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
