"use server"

import "server-only"
import type { HealthStatus } from "@lib/health"
import { cn } from "@lib/utils"

const COLORS = {
  active: "bg-[#10b981]",
  slowing: "bg-[#f59e0b]",
  stale: "bg-[#ef4444]",
}

export const HealthIndicator: React.FC<{ health: HealthStatus }> = async ({
  health,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-3 w-3 rounded-full", COLORS[health])} />
      <span className="text-sm font-medium capitalize">{health}</span>
    </div>
  )
}
