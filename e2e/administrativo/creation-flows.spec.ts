import { expect, test, type Page } from "@playwright/test";

const password = "Teste@12345";

function uniqueId() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function cpfFrom(seed: string) {
  return seed.slice(-11).padStart(11, "1");
}

async function openRadixSelect(page: Page, placeholder: RegExp) {
  await page.getByText(placeholder).click();
}

async function selectOption(page: Page, name: RegExp | string) {
  await page.getByRole("option", { name }).click();
}

async function expectDialogClosed(page: Page) {
  await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 60_000 });
}

async function submitDialog(page: Page, name: RegExp) {
  await page.getByRole("dialog").getByRole("button", { name }).click();
}

async function searchAndExpect(page: Page, value: string) {
  const search = page.getByPlaceholder(/Buscar/i).first();

  if ((await search.count()) > 0) {
    await search.fill(value);
  }

  await expect(page.getByText(value).first()).toBeVisible({
    timeout: 30_000,
  });
}

test.describe.serial("Administrativo - fluxos reais de criacao", () => {
  const run = uniqueId();
  const created = {
    aluno: `E2E Aluno ${run}`,
    professor: `E2E Professor ${run}`,
    usuario: `E2E Usuario ${run}`,
    disciplina: `E2E Conteudo ${run}`,
    curso: `E2E Curso ${run}`,
  };

  test("cria usuario interno", async ({ page }) => {
    await page.goto("/admin/users", { waitUntil: "load" });
    await page.getByRole("button", { name: /Novo Usu.rio/i }).click();

    await page.locator("#name").fill(created.usuario);
    await page.locator("#cpf").fill(cpfFrom(`${run}101`));
    await page.locator("#telefone").fill("(22) 99999-0001");
    await page.locator("#email").fill(`e2e.usuario.${run}@example.com`);
    await openRadixSelect(page, /Selecione a fun/i);
    await selectOption(page, /Recep/i);
    await page.locator("#password").fill(password);
    await page.locator("#observation").fill("Criado por teste E2E.");
    await submitDialog(page, /Criar Usu.rio/i);

    await expectDialogClosed(page);
    await searchAndExpect(page, created.usuario);
  });

  test("matricula aluno novo", async ({ page }) => {
    await page.goto("/admin/alunos", { waitUntil: "load" });
    await page.getByRole("button", { name: /Nova Matr/i }).click();

    await page.locator("#name").fill(created.aluno);
    await page.locator("#cpf").fill(cpfFrom(`${run}202`));
    await page.locator("#telefone").fill("(22) 99999-0002");
    await page.locator("#email").fill(`e2e.aluno.${run}@example.com`);
    await page.locator("#dateOfBirth").fill("2000-01-15");
    await page.locator("#password").fill(password);
    await submitDialog(page, /Realizar Matr/i);

    await expectDialogClosed(page);
    await searchAndExpect(page, created.aluno);
  });

  test("cria professor novo", async ({ page }) => {
    await page.goto("/admin/professores", { waitUntil: "load" });
    await page.getByRole("button", { name: /Novo Professor/i }).click();

    await page.locator("#name").fill(created.professor);
    await page.locator("#cpf").fill(cpfFrom(`${run}303`));
    await page.locator("#telefone").fill("(22) 99999-0003");
    await page.locator("#email").fill(`e2e.professor.${run}@example.com`);
    await page.locator("#password").fill(password);
    await submitDialog(page, /Criar Professor/i);

    await expectDialogClosed(page);
    await searchAndExpect(page, created.professor);
  });

  test("cria conteudo, curso e turma com vinculos", async ({ page }) => {
    await page.goto("/admin/disciplinas", { waitUntil: "load" });
    await page.getByRole("button", { name: /Novo Conte/i }).click();
    await page.getByPlaceholder(/Nome do conte/i).fill(created.disciplina);
    await page
      .getByPlaceholder(/^Conte/i)
      .fill("Conteudo criado automaticamente pelo Playwright.");
    await submitDialog(page, /Criar Conte/i);
    await expectDialogClosed(page);
    await searchAndExpect(page, created.disciplina);

    await page.goto("/admin/cursos", { waitUntil: "load" });
    await page.getByRole("button", { name: /Novo Curso/i }).click();
    await page.getByRole("dialog").getByRole("textbox").fill(created.curso);
    await page.getByRole("dialog").getByRole("spinbutton").fill("12");
    await submitDialog(page, /Salvar/i);
    await expectDialogClosed(page);
    await searchAndExpect(page, created.curso);

    await page.goto("/admin/turmas", { waitUntil: "load" });
    await page.getByRole("button", { name: /Nova Disciplina/i }).click();
    await page.locator("#startDate").fill("2026-05-01");
    await page.locator("#endDate").fill("2026-12-01");

    await openRadixSelect(page, /Selecione um professor/i);
    await selectOption(page, created.professor);
    await openRadixSelect(page, /Selecione uma disciplina/i);
    await selectOption(page, created.disciplina);

    await page.getByPlaceholder(/Buscar alunos/i).fill(created.aluno);
    await page.getByRole("button", { name: new RegExp(created.aluno) }).click();
    await expect(page.getByText(/1 aluno\(s\) selecionado\(s\)/i)).toBeVisible();

    await submitDialog(page, /Criar Turma/i);
    await expectDialogClosed(page);
    await page.goto("/admin/turmas", { waitUntil: "load" });
    await expect(page.getByText(created.disciplina).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByText(created.professor).first()).toBeVisible();
  });
});
