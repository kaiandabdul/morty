"use client";

import { useDashboardStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  PlayCircle,
  ChevronRight,
} from "lucide-react";

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-muted-foreground",
    badge: "secondary" as const,
  },
  running: {
    icon: PlayCircle,
    color: "text-blue-500",
    badge: "default" as const,
  },
  completed: {
    icon: CheckCircle2,
    color: "text-green-500",
    badge: "default" as const,
  },
  failed: {
    icon: XCircle,
    color: "text-destructive",
    badge: "destructive" as const,
  },
};

export function TaskList() {
  const { tasks, currentTask } = useDashboardStore();

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Tasks</CardTitle>
          <Badge variant="outline">
            {completedCount}/{totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs mt-1">
              Tasks will appear when Morty starts working
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-2">
              <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => {
                  const config = statusConfig[task.status];
                  const Icon = config.icon;
                  const isActive = currentTask?.id === task.id;

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border
                        ${isActive ? "border-primary bg-primary/5" : "border-transparent bg-muted/50"}
                      `}
                    >
                      <div className={config.color}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {task.title}
                        </p>
                        {task.error && (
                          <p className="text-xs text-destructive truncate mt-0.5">
                            {task.error}
                          </p>
                        )}
                        {task.startTime && task.endTime && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDuration(task.endTime - task.startTime)}
                          </p>
                        )}
                      </div>

                      {isActive && (
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ChevronRight className="h-4 w-4 text-primary" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}
