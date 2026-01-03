import { Suspense } from "react";
import DiaryListClient from "./list-client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DiaryListClient />
    </Suspense>
  );
}
