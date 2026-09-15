import { AgentWorkspace } from "@/components/workspace/AgentWorkspace";

export default async function AgentLayout({ children, params }: LayoutProps<"/agents/[id]">) {
  const { id } = await params;
  return <AgentWorkspace id={id}>{children}</AgentWorkspace>;
}
