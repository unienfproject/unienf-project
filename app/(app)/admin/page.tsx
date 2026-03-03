import OverAllAdmin from "@/app/_components/admin/OverAllAdmin";
import { DashboardStats, getStudentRegistrationsStats } from "@/app/_lib/actions/dashboard";
import { listPendingDocumentsForDashboard } from "@/app/_lib/actions/documents"; // ajuste para o nome real da sua action
import { listRecentAuditActivities } from "@/app/_lib/actions/audit";

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parseDateParam(value: string | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default async function AdminPage(props: Props) {
  const searchParams = await props.searchParams;

  const dateTo = parseDateParam(
    typeof searchParams.to === "string" ? searchParams.to : undefined,
  ) ?? new Date();
  const dateFrom =
    parseDateParam(
      typeof searchParams.from === "string" ? searchParams.from : undefined,
    ) ?? new Date(new Date(dateTo).getFullYear(), dateTo.getMonth() - 5, 1);

  const [stats, initialRows, registrationStats, recentActivities] = await Promise.all([
    DashboardStats(),
    listPendingDocumentsForDashboard(),
    getStudentRegistrationsStats(dateFrom, dateTo),
    listRecentAuditActivities(6),
  ]);

  return (
    <OverAllAdmin
      stats={stats}
      initialRows={initialRows}
      registrationStats={registrationStats}
      recentActivities={recentActivities}
    />
  );
}
