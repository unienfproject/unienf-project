export const metadata = {
  title: "Termos de Uso | UNIENF",
};

export default function TermosDeUsoPage() {
  return (
    <main className="bg-background min-h-screen">
      <section className="container mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <header className="mb-10">
          <p className="text-primary text-sm font-semibold tracking-wider uppercase">
            UNIENF
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-bold md:text-4xl">
            Termos de Uso
          </h1>
          <p className="text-muted-foreground mt-3 text-base">
            Estes Termos regulam o acesso e o uso do sistema UNIENF (área do
            aluno e área interna). Ao acessar ou utilizar o sistema, você
            concorda com as condições abaixo.
          </p>
          <p className="text-muted-foreground mt-3 text-sm">
            Última atualização: 07/01/2026
          </p>
        </header>

        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              1. Definições
            </h2>
            <p className="text-muted-foreground">
              “UNIENF” refere-se à instituição e ao sistema disponibilizado para
              gestão de informações acadêmicas e administrativas. “Usuário” é
              qualquer pessoa que acessa o sistema, incluindo alunos, docentes e
              equipe administrativa (recepção, coordenação e setor
              administrativo).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              2. Elegibilidade e cadastro
            </h2>
            <p className="text-muted-foreground">
              O acesso pode exigir cadastro e autenticação. O Usuário se
              compromete a fornecer informações verdadeiras e atualizadas.
              Credenciais são pessoais e intransferíveis, e o Usuário é
              responsável por manter a confidencialidade de login e senha.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              3. Perfis e permissões de acesso
            </h2>
            <p className="text-muted-foreground">
              O sistema possui níveis de acesso (roles) conforme a função do
              Usuário. Cada perfil visualiza e altera apenas as informações
              permitidas pelas regras internas e pela configuração do sistema.
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <span className="text-foreground font-medium">Aluno:</span>{" "}
                visualiza dados pessoais acadêmicos, documentação, avisos e
                informações financeiras (quando aplicável).
              </li>
              <li>
                <span className="text-foreground font-medium">Professor:</span>{" "}
                acessa turmas vinculadas, lança notas e frequência, e visualiza
                avisos conforme configuração.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Recepção/Coordenação:
                </span>{" "}
                gerencia cadastros, acompanha documentação e realiza rotinas
                administrativas e financeiras conforme permissão.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Administrativo:
                </span>{" "}
                visão geral e gerenciamento ampliado, incluindo controles
                financeiros e custos internos conforme regras internas.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              4. Uso adequado e condutas proibidas
            </h2>
            <p className="text-muted-foreground">
              É proibido utilizar o sistema para fins ilícitos, tentar obter
              acesso não autorizado, interferir na integridade do serviço, fazer
              engenharia reversa, automatizar acessos sem autorização, ou
              compartilhar credenciais. O descumprimento pode gerar suspensão de
              acesso e medidas administrativas e legais cabíveis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              5. Conteúdo e informações inseridas
            </h2>
            <p className="text-muted-foreground">
              O Usuário é responsável pelas informações enviadas no sistema
              quando aplicável (por exemplo, dados cadastrais e documentação). A
              UNIENF pode solicitar correções, complementações ou validações
              para fins acadêmicos e administrativos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              6. Disponibilidade e manutenção
            </h2>
            <p className="text-muted-foreground">
              A UNIENF busca manter o sistema disponível e seguro, mas pode
              haver indisponibilidades temporárias por manutenção, atualizações,
              falhas de rede ou fatores fora de controle. Não há garantia de
              disponibilidade ininterrupta.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              7. Propriedade intelectual
            </h2>
            <p className="text-muted-foreground">
              A interface, layout, marca, textos e demais elementos do sistema
              são protegidos por direitos aplicáveis. É vedada a reprodução ou
              exploração não autorizada.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              8. Suspensão e encerramento de acesso
            </h2>
            <p className="text-muted-foreground">
              A UNIENF pode suspender ou restringir acesso quando houver indício
              de uso inadequado, violação de regras, risco de segurança ou
              necessidade administrativa, respeitando procedimentos internos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              9. Alterações destes Termos
            </h2>
            <p className="text-muted-foreground">
              Estes Termos podem ser atualizados para refletir mudanças legais,
              operacionais ou tecnológicas. A versão vigente estará disponível
              nesta página.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              10. Contato
            </h2>
            <p className="text-muted-foreground">
              Em caso de dúvidas sobre estes Termos, entre em contato com a
              UNIENF pelos canais oficiais.
            </p>
            <p className="text-muted-foreground text-sm">
              Sugestão: inserir e-mail/telefone oficial e endereço da
              instituição.
            </p>
          </section>
        </div>

        <footer className="border-border/50 mt-12 border-t pt-6">
          <p className="text-muted-foreground text-sm">
            Ao utilizar o sistema, você declara ciência e concordância com estes
            Termos de Uso.
          </p>
        </footer>
      </section>
    </main>
  );
}
