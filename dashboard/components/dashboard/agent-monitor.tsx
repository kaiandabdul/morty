"use client";

import { motion } from "motion/react";
import { useDashboardStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  FileText,
  Pencil,
  Terminal,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const stepIcons: Record<string, React.ReactNode> = {
  Thinking: <Brain className="h-5 w-5" />,
  "Reading code": <FileText className="h-5 w-5" />,
  Implementing: <Pencil className="h-5 w-5" />,
  "Writing tests": <FileText className="h-5 w-5" />,
  Testing: <Terminal className="h-5 w-5" />,
  Linting: <Terminal className="h-5 w-5" />,
  Committing: <CheckCircle2 className="h-5 w-5" />,
  Staging: <FileText className="h-5 w-5" />,
  Idle: <Loader2 className="h-5 w-5" />,
};

export function AgentMonitor() {
  const { currentStep, currentTask, session, connected } = useDashboardStore();

  const isActive = currentTask !== null;
  const icon = stepIcons[currentStep] || <Brain className="h-5 w-5" />;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
          <Badge variant={connected ? "default" : "destructive"}>
            {connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* Animated Icon */}
          <motion.div
            className={`p-3 rounded-xl ${
              isActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
          >
            {isActive ? icon : <Loader2 className="h-5 w-5" />}
          </motion.div>

          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold truncate">{currentStep}</p>
            {currentTask && (
              <p className="text-sm text-muted-foreground truncate">
                {currentTask.title}
              </p>
            )}
            {!currentTask && session && (
              <p className="text-sm text-muted-foreground">
                Waiting for task...
              </p>
            )}
            {!session && (
              <p className="text-sm text-muted-foreground">No active session</p>
            )}
          </div>
        </div>

        {/* Activity Indicator */}
        {isActive && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Progress value={undefined} className="h-1" />
          </motion.div>
        )}
      </CardContent>

      {/* Pulse effect when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 border-2 border-primary/20 rounded-lg pointer-events-none"
          animate={{ opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </Card>
  );
}
