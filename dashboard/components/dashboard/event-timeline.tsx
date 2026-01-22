"use client";

import { useDashboardStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Pencil,
  Terminal,
  Brain,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Zap,
} from "lucide-react";

const eventIcons: Record<string, React.ReactNode> = {
  "session:start": <PlayCircle className="h-3.5 w-3.5" />,
  "session:end": <CheckCircle2 className="h-3.5 w-3.5" />,
  "task:start": <PlayCircle className="h-3.5 w-3.5" />,
  "task:complete": <CheckCircle2 className="h-3.5 w-3.5" />,
  "task:fail": <XCircle className="h-3.5 w-3.5" />,
  "step:update": <Brain className="h-3.5 w-3.5" />,
  "file:read": <FileText className="h-3.5 w-3.5" />,
  "file:write": <Pencil className="h-3.5 w-3.5" />,
  "command:run": <Terminal className="h-3.5 w-3.5" />,
  "tokens:update": <Zap className="h-3.5 w-3.5" />,
};

const eventColors: Record<string, string> = {
  "session:start": "text-blue-500 bg-blue-500/10",
  "session:end": "text-gray-500 bg-gray-500/10",
  "task:start": "text-blue-500 bg-blue-500/10",
  "task:complete": "text-green-500 bg-green-500/10",
  "task:fail": "text-red-500 bg-red-500/10",
  "step:update": "text-purple-500 bg-purple-500/10",
  "file:read": "text-yellow-500 bg-yellow-500/10",
  "file:write": "text-orange-500 bg-orange-500/10",
  "command:run": "text-cyan-500 bg-cyan-500/10",
  "tokens:update": "text-green-500 bg-green-500/10",
};

export function EventTimeline() {
  const { events } = useDashboardStore();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Activity</CardTitle>
          <Badge variant="outline">{events.length} events</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {events.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No activity yet</p>
            <p className="text-xs mt-1">Events will stream in real-time</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-1">
              <AnimatePresence mode="popLayout">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2 py-1.5"
                  >
                    <div
                      className={`p-1.5 rounded-md ${eventColors[event.type] || "text-muted-foreground bg-muted"}`}
                    >
                      {eventIcons[event.type] || (
                        <Zap className="h-3.5 w-3.5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        {formatEventMessage(event)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(event.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function formatEventMessage(event: {
  type: string;
  data: Record<string, unknown>;
}): string {
  switch (event.type) {
    case "session:start":
      return `Session started with ${event.data.engine}`;
    case "session:end":
      return "Session ended";
    case "task:start":
      return `Started: ${event.data.title}`;
    case "task:complete":
      return `Completed: ${event.data.title}`;
    case "task:fail":
      return `Failed: ${event.data.title}`;
    case "step:update":
      return `${event.data.step}`;
    case "file:read":
      return `Reading ${getFileName(event.data.path as string)}`;
    case "file:write":
      return `Writing ${getFileName(event.data.path as string)}`;
    case "command:run":
      return `Running: ${truncate(event.data.command as string, 40)}`;
    case "tokens:update":
      return `Tokens: +${event.data.output} output`;
    default:
      return event.type;
  }
}

function getFileName(path: string): string {
  return path.split("/").pop() || path;
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
