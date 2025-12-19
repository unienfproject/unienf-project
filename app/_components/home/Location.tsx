import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function Location() {
  return (
    <section id="localizacao" className="bg-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Localização
          </span>
          <h2 className="text-foreground mt-3 mb-6 text-3xl font-bold md:text-4xl">
            Venha nos conhecer
          </h2>
          <p className="text-muted-foreground text-lg">
            Estamos localizados em uma região de fácil acesso, em São Pedro da Aldeia.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="shadow-medium border-border/50 animate-slide-in-left h-[400px] overflow-hidden rounded-2xl border">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3677.1763739633593!2d-42.10735852469177!3d-22.832963279307094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x970fb97cc65167%3A0xfaad73cbd70fe859!2sUNIENF%20Lagos!5e0!3m2!1spt-BR!2sbr!4v1766110304598!5m2!1spt-BR!2sbr" 
          width="600" 
          height="450">
          </iframe>
          </div>
          <div className="animate-slide-up flex flex-col justify-center space-y-6">
            <div className="bg-card border-border/50 shadow-soft hover-lift rounded-2xl border p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1 font-semibold">
                    Endereço
                  </h3>
                  <p className="text-muted-foreground">
                    R. São João, 520 - Estação <br />
                    São Pedro da Aldeia - RJ, 28940-000
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border-border/50 shadow-soft hover-lift rounded-2xl border p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
                  <Phone className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1 font-semibold">
                    Telefone
                  </h3>
                  <p className="text-muted-foreground">
                    (22) 2621-1627
                    <br />
                    (22) 98765-4321 (WhatsApp) {/**Alterar contato para whatsapp da empresa.*/}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border-border/50 shadow-soft hover-lift rounded-2xl border p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
                  <Mail className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1 font-semibold">E-mail</h3>
                  <p className="text-muted-foreground">
                    contato@unienf.com.br
                    <br />
                    unienflagos@gmail.com
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border-border/50 shadow-soft hover-lift rounded-2xl border p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl">
                  <Clock className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1 font-semibold">
                    Horário de Funcionamento
                  </h3>
                  <p className="text-muted-foreground">
                    Segunda a Sexta: 8h às 21h
                    <br />
                    Sábado: 8h às 12h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
