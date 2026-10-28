import { redirect } from "next/navigation";

/** Leads were renamed Customers; old links still land. */
export default function RecordLeadsRedirect() {
  redirect("/records/customers");
}
