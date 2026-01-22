"use client";

import { useDashboardStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { Zap, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function TokenStats() {
  const { tokens } = useDashboardStore();

  const stats = [
    {
      label: "Input Tokens",
      value: tokens.inputTokens,
      icon: ArrowDownRight,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Output Tokens",
      value: tokens.outputTokens,
      icon: ArrowUpRight,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Est. Cost",
      value: `$${tokens.estimatedCost.toFixed(4)}`,
      icon: DollarSign,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      isPrice: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Token Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div
                className={`inline-flex p-2 rounded-lg ${stat.bgColor} mb-2`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <motion.p
                key={String(stat.value)}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-lg font-bold tabular-nums"
              >
                {stat.isPrice ? stat.value : formatNumber(stat.value as number)}
              </motion.p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}
