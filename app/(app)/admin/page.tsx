import OverAllAdmin from "@/app/_components/admin/OverAllAdmin";
import { DashboardStats } from "@/app/_lib/actions/dashboard";
import { listPendingDocumentsForDashboard } from "@/app/_lib/actions/documents"; // ajuste para o nome real da sua action

export default async function AdminPage() {
  const [stats, initialRows] = await Promise.all([
    DashboardStats(),
    listPendingDocumentsForDashboard(),
  ]);

  return <OverAllAdmin stats={stats} initialRows={initialRows} />;
}
