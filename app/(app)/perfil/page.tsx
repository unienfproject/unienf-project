import { getMyAccountProfile } from "@/app/_lib/actions/me";
import PerfilClient from "./PerfilClient";

export default async function PerfilPage() {
  const me = await getMyAccountProfile();

  return (
    <div className="flex-1 p-6">
      <PerfilClient me={me} />
    </div>
  );
}
