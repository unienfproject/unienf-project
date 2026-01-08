export const metadata = {
  title: "Política de Privacidade | UNIENF",
};

export default function PoliticaPrivacidadePage() {
  return (
    <main className="bg-background min-h-screen">
      <section className="container mx-auto max-w-3xl px-4 py-12 lg:py-16">
        <header className="mb-10">
          <p className="text-primary text-sm font-semibold tracking-wider uppercase">
            UNIENF
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-bold md:text-4xl">
            Política de Privacidade
          </h1>
          <p className="text-muted-foreground mt-3 text-base">
            Esta Política descreve como a UNIENF coleta, usa, armazena e protege
            dados pessoais no sistema (área do aluno e área interna). O
            tratamento de dados é realizado para fins acadêmicos e
            administrativos, observando a legislação aplicável, incluindo a LGPD
            (Lei nº 13.709/2018).
          </p>
          <p className="text-muted-foreground mt-3 text-sm">
            Última atualização: 07/01/2026
          </p>
        </header>

        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              1. Dados coletados
            </h2>
            <p className="text-muted-foreground">
              Podemos tratar os seguintes dados, conforme o perfil do Usuário e
              uso do sistema:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>
                <span className="text-foreground font-medium">
                  Dados cadastrais:
                </span>{" "}
                nome, e-mail, telefone, data de nascimento, CPF e informações
                similares necessárias ao cadastro e à gestão acadêmica.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Dados acadêmicos:
                </span>{" "}
                turmas, disciplinas, notas, frequência, avisos e histórico
                acadêmico.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Documentação:
                </span>{" "}
                status de entrega (pendente/entregue) e observações internas.
                Quando aplicável, arquivos anexados pelo aluno podem ser
                armazenados.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Dados financeiros:
                </span>{" "}
                mensalidades (status, valor, forma de pagamento e data de
                pagamento), além de custos internos quando inseridos pela equipe
                autorizada.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Dados técnicos:
                </span>{" "}
                registros de acesso, logs de auditoria, dispositivo/navegador e
                informações necessárias para segurança e prevenção de fraudes.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              2. Finalidades do uso
            </h2>
            <p className="text-muted-foreground">
              Os dados são utilizados para:
            </p>
            <ul className="text-muted-foreground list-disc space-y-2 pl-6">
              <li>Autenticação e controle de acesso por perfil (role).</li>
              <li>Gestão acadêmica (turmas, notas, frequência e avisos).</li>
              <li>Gestão de documentação e atendimento administrativo.</li>
              <li>
                Gestão financeira (mensalidades e recibos quando aplicável).
              </li>
              <li>Segurança, auditoria, suporte e melhoria do sistema.</li>
              <li>Cumprimento de obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              3. Base legal (LGPD)
            </h2>
            <p className="text-muted-foreground">
              O tratamento pode ocorrer com base em diferentes hipóteses legais,
              conforme o caso, incluindo execução de contrato/serviço,
              cumprimento de obrigação legal/regulatória, exercício regular de
              direitos e legítimo interesse, sempre observando os princípios da
              LGPD.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              4. Compartilhamento de dados
            </h2>
            <p className="text-muted-foreground">
              A UNIENF pode compartilhar dados com prestadores de serviço e
              fornecedores de infraestrutura tecnológica necessários para
              operação do sistema (por exemplo, hospedagem, banco de dados e
              armazenamento). O compartilhamento ocorre conforme necessidade
              operacional, com medidas de segurança e acesso limitado.
            </p>
            <p className="text-muted-foreground">
              Também pode haver compartilhamento quando exigido por lei, ordem
              judicial ou para proteção de direitos da UNIENF.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              5. Armazenamento e segurança
            </h2>
            <p className="text-muted-foreground">
              Adotamos medidas técnicas e organizacionais para proteger os dados
              contra acesso não autorizado, perda, alteração indevida e
              vazamento. Ainda assim, nenhum sistema é completamente imune a
              riscos. Por isso, o Usuário deve manter credenciais em sigilo e
              usar práticas seguras.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              6. Retenção e exclusão
            </h2>
            <p className="text-muted-foreground">
              Os dados são mantidos pelo tempo necessário para cumprir as
              finalidades desta Política, obrigações legais e procedimentos
              acadêmicos/administrativos. Após esse período, podem ser excluídos
              ou anonimizados, quando aplicável.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              7. Direitos do titular
            </h2>
            <p className="text-muted-foreground">
              Conforme a LGPD, o titular pode solicitar confirmação de
              tratamento, acesso, correção, anonimização, portabilidade e
              informações sobre compartilhamento, quando aplicável, além de
              demais direitos previstos em lei.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              8. Cookies e tecnologias similares
            </h2>
            <p className="text-muted-foreground">
              O sistema pode utilizar cookies estritamente necessários para
              autenticação, sessão e segurança. Se houver uso de cookies de
              desempenho/estatística no futuro, esta Política poderá ser
              atualizada com maiores detalhes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              9. Alterações desta Política
            </h2>
            <p className="text-muted-foreground">
              Esta Política pode ser atualizada para refletir mudanças legais ou
              operacionais. A versão vigente será mantida nesta página.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-foreground text-xl font-semibold">
              10. Contato do responsável
            </h2>
            <p className="text-muted-foreground">
              Para solicitações relacionadas a privacidade e proteção de dados,
              entre em contato pelos canais oficiais da UNIENF.
            </p>
            <p className="text-muted-foreground text-sm">
              Sugestão: inserir e-mail/telefone oficial e/ou responsável pelo
              atendimento LGPD.
            </p>
          </section>
        </div>

        <footer className="border-border/50 mt-12 border-t pt-6">
          <p className="text-muted-foreground text-sm">
            Ao utilizar o sistema, você declara ciência desta Política de
            Privacidade.
          </p>
        </footer>
      </section>
    </main>
  );
}
