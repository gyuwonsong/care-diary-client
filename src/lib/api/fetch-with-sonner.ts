import { toast } from "sonner";

export async function fetchWithSonner(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);

  if (res.ok) return res;

  try {
    const cloned = res.clone();
    const json = await cloned.json();

    const message =
      json?.message ||
      json?.error?.message ||
      `요청에 실패했습니다. (${res.status})`;

    toast.error(message);
  } catch {
    toast.error(`요청에 실패했습니다. (${res.status})`);
  }

  return res;
}
