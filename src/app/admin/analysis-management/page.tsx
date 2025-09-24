"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Loader, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { TablePaginationBar } from "@/components/common/table-pagination-bar";

type RecordStatus = "completed" | "in-progress" | "stopped" | "pending";

type AnalysisRecord = {
  id: string;
  no: number;
  userName: string;
  patientId: string;
  analysisDate: string;
  status: RecordStatus;
};

const mockAnalysisRecords: AnalysisRecord[] = [
  {
    id: "A001",
    no: 1,
    userName: "김의사",
    patientId: "P001",
    analysisDate: "2024-05-23 14:30",
    status: "completed",
  },
  {
    id: "A002",
    no: 2,
    userName: "이간호사",
    patientId: "P002",
    analysisDate: "2024-05-23 13:15",
    status: "in-progress",
  },
  {
    id: "A003",
    no: 3,
    userName: "박연구원",
    patientId: "P003",
    analysisDate: "2024-05-23 11:45",
    status: "stopped",
  },
  {
    id: "A004",
    no: 4,
    userName: "김의사",
    patientId: "P004",
    analysisDate: "2024-05-22 16:20",
    status: "pending",
  },
];

function StatusBadge({ status }: { status: RecordStatus }) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 min-w-[70px] justify-center">
          <CheckCircle className="h-3.5 w-3.5" />
          완료
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1 min-w-[70px] justify-center">
          <Loader className="h-3.5 w-3.5" />
          진행중
        </Badge>
      );
    case "stopped":
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1 min-w-[70px] justify-center">
          <XCircle className="h-3.5 w-3.5" />
          중지됨
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 min-w-[70px] justify-center">
          <Clock className="h-3.5 w-3.5" />
          대기
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1 min-w-[70px] justify-center">
          알수없음
        </Badge>
      );
  }
}

export default function AnalysisManagementPage() {
  const [records] = useState<AnalysisRecord[]>(mockAnalysisRecords);

  const [page, setPage] = useState(1);
  const perPage = 10;

  const sorted = useMemo(
    () =>
      [...records].sort((a, b) => b.analysisDate.localeCompare(a.analysisDate)),
    [records],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const pageStart = (page - 1) * perPage;
  const pageEnd = page * perPage;
  const pageRows = sorted.slice(pageStart, pageEnd);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const startIdx = sorted.length ? pageStart + 1 : 0;
  const endIdx = Math.min(pageEnd, sorted.length);

  return (
    <div className="min-h-screen bg-background w-full overflow-auto">
      <div className="container mx-auto p-8">
        <div className="space-y-6">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-foreground">
              분석기록 관리
            </h1>
            <p className="text-muted-foreground">
              시스템 분석 기록 조회 및 관리
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border rounded-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-center py-3 px-4 border-b border-border text-sm font-medium">
                    No
                  </th>
                  <th className="text-center py-3 px-4 border-b border-border text-sm font-medium">
                    사용자
                  </th>
                  <th className="text-center py-3 px-4 border-b border-border text-sm font-medium">
                    대상자 ID
                  </th>
                  <th className="text-center py-3 px-4 border-b border-border text-sm font-medium">
                    분석일시
                  </th>
                  <th className="text-center py-3 px-4 border-b border-border text-sm font-medium">
                    상태
                  </th>
                  <th className="text-center py-3 px-4 border-b border-border text-sm font-medium">
                    상세보기
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((record) => (
                  <tr key={record.id} className="bg-white">
                    <td className="text-center py-3 px-4 border-b border-border text-sm">
                      {record.no}
                    </td>
                    <td className="text-center py-3 px-4 border-b border-border text-sm">
                      {record.userName}
                    </td>
                    <td className="text-center py-3 px-4 border-b border-border text-sm">
                      {record.patientId}
                    </td>
                    <td className="text-center py-3 px-4 border-b border-border text-sm">
                      {record.analysisDate}
                    </td>
                    <td className="py-3 px-4 border-b border-border text-sm">
                      <div className="flex justify-center items-center">
                        <StatusBadge status={record.status} />
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 border-b border-border text-sm">
                      <Link href={`/admin/analysis-management/${record.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-sm bg-transparent"
                        >
                          <Eye className="h-4 w-4" />
                          상세보기
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      표시할 데이터가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {sorted.length > 0 && (
            <TablePaginationBar
              total={sorted.length}
              page={page}
              totalPages={totalPages}
              startIdx={startIdx}
              endIdx={endIdx}
              onPageChangeAction={setPage}
              noun="건"
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
}
