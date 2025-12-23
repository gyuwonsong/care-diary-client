import { AdminGuard } from "@/components/auth/admin-guard";
import SdohResultsContent from "@/components/admin/sdoh-results-content";

interface SdohParams {
  diaryId: string;
}

export default async function SdohResultsPage({
  params,
}: {
  params: Promise<SdohParams>;
}) {
  const { diaryId } = await params;

  return (
    <AdminGuard>
      <SdohResultsContent diaryId={diaryId} />
    </AdminGuard>
  );
}
