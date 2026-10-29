"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { Lead } from "@/types/records";
import { CustomerEditModal } from "./CustomerEditModal";
import { actionsColumn } from "./rowActions";

/** The customer table's Edit button and its dialog, for every view that lists customers. */
export function useCustomerEdit(onSaved: () => void) {
  const [editing, setEditing] = useState<Lead | null>(null);

  const column = actionsColumn<Lead>([{ label: "Edit customer", icon: <Pencil />, onSelect: setEditing }]);

  const dialog = editing && <CustomerEditModal lead={editing} onClose={() => setEditing(null)} onSaved={onSaved} />;

  return { column, dialog };
}
