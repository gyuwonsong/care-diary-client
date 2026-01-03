import { Suspense } from "react";
import DiaryWriteClient from "./write-client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DiaryWriteClient />
    </Suspense>
  );
}
