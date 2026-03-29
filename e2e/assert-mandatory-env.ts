/**
 * Credenciais obrigatórias para o projeto E2E (todas as roles exceto coordenação).
 * Coordenação é opcional: ausência de E2E_COORDENACAO_* não gera erro.
 */
export function assertMandatoryE2ECredentials(): void {
  const pairs: [string, string, string][] = [
    ["E2E_ALUNO_EMAIL", "E2E_ALUNO_PASSWORD", "aluno"],
    ["E2E_PROFESSOR_EMAIL", "E2E_PROFESSOR_PASSWORD", "professor"],
    ["E2E_RECEPCAO_EMAIL", "E2E_RECEPCAO_PASSWORD", "recepção"],
    [
      "E2E_ADMINISTRATIVO_EMAIL",
      "E2E_ADMINISTRATIVO_PASSWORD",
      "administrativo",
    ],
  ];

  const missing: string[] = [];
  for (const [emailKey, passwordKey, label] of pairs) {
    const email = process.env[emailKey]?.trim();
    const password = process.env[passwordKey];
    if (!email || !password) {
      missing.push(`  - ${emailKey} e ${passwordKey} (role: ${label})`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      [
        "E2E: faltam credenciais obrigatórias no ambiente.",
        "Copie .env.e2e.example para .env.e2e e preencha os pares e-mail/senha.",
        "",
        "Variáveis ausentes ou vazias:",
        ...missing,
      ].join("\n"),
    );
  }
}
