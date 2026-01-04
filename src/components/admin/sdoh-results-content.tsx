"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { adminDiariyApi } from "@/lib/api/client";
import { cn } from "@/lib/utils";

import type {
  CommonResponseAdminDiarySdohResponse,
  DiarySdohItemDto,
} from "@/generated-api";

function getMajorTitle(item: DiarySdohItemDto): string {
  return item.majorCat?.trim() || "기타";
}

function toTableItem(item: DiarySdohItemDto) {
  return {
    key: `${item.elementNo}-${item.signCode ?? "NA"}`,
    label:
      item.typeLabel ??
      item.subCat ??
      item.middleCat ??
      item.majorCat ??
      `항목 ${item.elementNo}`,
    signCode: item.signCode ?? "-",
    severity: item.severity ?? "-",
    duration: item.duration ?? "-",
    coping: item.coping ?? "-",
    recommendation: item.recommendation ?? "-",
    evidences: item.evidences ?? [],
  };
}

function SdohTable({
  title,
  items,
}: {
  title: string;
  items: ReturnType<typeof toTableItem>[];
}) {
  return (
    <div className="mb-10">
      <h3 className="mb-3 text-base font-semibold">{title}</h3>

      <div className="overflow-hidden rounded-sm border border-border bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border-b border-r border-border p-2 text-sm font-medium text-left w-[36%]">
                항목
              </th>
              <th className="border-b border-r border-border p-2 text-sm font-medium text-center w-[8%]">
                부호
              </th>
              <th className="border-b border-r border-border p-2 text-sm font-medium text-center w-[8%]">
                심각성
              </th>
              <th className="border-b border-r border-border p-2 text-sm font-medium text-center w-[8%]">
                지속기간
              </th>
              <th className="border-b border-r border-border p-2 text-sm font-medium text-center w-[8%]">
                대처능력
              </th>
              <th className="border-b border-border p-2 text-sm font-medium text-left">
                권고되는 개입 / 근거
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((it, idx) => (
              <tr
                key={it.key}
                className={cn(
                  "text-sm",
                  idx !== items.length - 1 && "border-b border-border",
                )}
              >
                <td className="p-3">{it.label}</td>
                <td className="p-3 text-center">{it.signCode}</td>
                <td className="p-3 text-center">{it.severity}</td>
                <td className="p-3 text-center">{it.duration}</td>
                <td className="p-3 text-center">{it.coping}</td>
                <td className="p-3 space-y-2">
                  <p>{it.recommendation}</p>
                  {it.evidences.length > 0 && (
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {it.evidences.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-sm text-muted-foreground"
                >
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SdohResultsContent({ diaryId }: { diaryId: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<DiarySdohItemDto[]>([]);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const res: CommonResponseAdminDiarySdohResponse =
          await adminDiariyApi.findSdoh({ diaryId });

        const list = res?.data?.items ?? [];
        if (mounted) setItems(list);
      } catch (error) {
        console.error("Failed to fetch SDoH data:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [diaryId]);

  const grouped = useMemo(() => {
    const map = new Map<string, ReturnType<typeof toTableItem>[]>();

    for (const item of items) {
      const title = getMajorTitle(item);
      const arr = map.get(title) ?? [];
      arr.push(toTableItem(item));
      map.set(title, arr);
    }

    return Array.from(map.entries());
  }, [items]);

  if (loading) {
    return <div className="min-h-screen bg-muted p-6">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted p-6">
        <Card className="rounded-sm">
          <CardContent className="p-6 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="container max-w-5xl mx-auto py-8 pb-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">SDoH 분석 결과</h2>
          <Button
            variant="outline"
            className="rounded-sm"
            onClick={() => router.back()}
          >
            돌아가기
          </Button>
        </div>

        <Card className="rounded-sm">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">
              사회적 건강 결정요인(SDoH)
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {grouped.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                SDoH 데이터가 없습니다.
              </div>
            ) : (
              grouped.map(([title, list]) => (
                <SdohTable key={title} title={title} items={list} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
