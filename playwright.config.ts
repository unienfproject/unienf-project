import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { assertMandatoryE2ECredentials } from "./e2e/assert-mandatory-env";

dotenv.config({ path: ".env.e2e" });

if (!process.argv.includes("--list")) {
  assertMandatoryE2ECredentials();
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const isCI = Boolean(process.env.CI);

const hasCoordenacaoCreds =
  Boolean(process.env.E2E_COORDENACAO_EMAIL?.trim()) &&
  Boolean(process.env.E2E_COORDENACAO_PASSWORD?.trim());

const roleProjects: NonNullable<
  Parameters<typeof defineConfig>[0]["projects"]
> = [
  {
    name: "aluno",
    use: {
      ...devices["Desktop Chrome"],
      storageState: path.join(process.cwd(), ".auth", "aluno.json"),
    },
    dependencies: ["setup"],
    testMatch: "**/aluno/**/*.spec.ts",
  },
  {
    name: "professor",
    use: {
      ...devices["Desktop Chrome"],
      storageState: path.join(process.cwd(), ".auth", "professor.json"),
    },
    dependencies: ["setup"],
    testMatch: "**/professor/**/*.spec.ts",
  },
  {
    name: "recepcao",
    use: {
      ...devices["Desktop Chrome"],
      storageState: path.join(process.cwd(), ".auth", "recepcao.json"),
    },
    dependencies: ["setup"],
    testMatch: "**/recepcao/**/*.spec.ts",
  },
  {
    name: "administrativo",
    use: {
      ...devices["Desktop Chrome"],
      storageState: path.join(process.cwd(), ".auth", "administrativo.json"),
    },
    dependencies: ["setup"],
    testMatch: "**/administrativo/**/*.spec.ts",
  },
];

if (hasCoordenacaoCreds) {
  roleProjects.push({
    name: "coordenacao",
    use: {
      ...devices["Desktop Chrome"],
      storageState: path.join(process.cwd(), ".auth", "coordenacao.json"),
    },
    dependencies: ["setup"],
    testMatch: "**/coordenacao/**/*.spec.ts",
  });
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? "github" : "html",
  timeout: 60_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      fullyParallel: false,
    },
    ...roleProjects,
  ],
  webServer: isCI
    ? {
        command: "npm run build && npm run start",
        url: baseURL,
        reuseExistingServer: false,
        timeout: 300_000,
      }
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
