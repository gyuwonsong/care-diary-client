"use client";

import { Button } from "@/components/ui/button";

type TablePaginationBarProps = {
  total: number;
  page: number;
  totalPages: number;
  startIdx: number;
  endIdx: number;
  onPageChangeAction: (page: number) => void;
  noun?: string;
  className?: string;
};

export function TablePaginationBar({
  total,
  page,
  totalPages,
  startIdx,
  endIdx,
  onPageChangeAction,
  noun = "건",
  className,
}: TablePaginationBarProps) {
  const goTo = (next: number) => {
    const clamped = Math.max(1, Math.min(totalPages, next));
    if (clamped !== page) onPageChangeAction(clamped);
  };

  if (total <= 0) return null;

  return (
    <div
      className={
        "flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2 " +
        (className ?? "")
      }
    >
      <div className="text-sm text-muted-foreground text-center md:text-left">
        총 <span className="font-medium text-foreground">{total}</span>
        {noun} 중{" "}
        <span className="font-medium text-foreground">{startIdx}</span>–
        <span className="font-medium text-foreground">{endIdx}</span>
        표시
      </div>

      <div className="flex items-center justify-center md:justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm"
          onClick={() => goTo(1)}
          disabled={page === 1}
        >
          처음
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm"
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
        >
          이전
        </Button>
        <div className="text-sm w-16 text-center">
          {page} / {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm"
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
        >
          다음
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-sm"
          onClick={() => goTo(totalPages)}
          disabled={page === totalPages}
        >
          마지막
        </Button>
      </div>
    </div>
  );
}
