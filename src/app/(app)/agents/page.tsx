import { redirect } from "next/navigation";

/** Home lives at `/` now. Older links — `/agents?task=…` among them — still land on it. */
export default async function AgentsRedirect({ searchParams }: PageProps<"/agents">) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const item of Array.isArray(value) ? value : [value]) if (item) query.append(key, item);
  }
  const search = query.toString();
  redirect(search ? `/?${search}` : "/");
}
