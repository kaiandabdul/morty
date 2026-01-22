"use client";

import { useDashboardStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Pencil } from "lucide-react";

export function RecentFiles() {
  const { recentFiles } = useDashboardStore();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Recent Files</CardTitle>
          <Badge variant="outline">{recentFiles.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {recentFiles.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No file activity</p>
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="p-4 space-y-1">
              <AnimatePresence mode="popLayout">
                {recentFiles.map((file, index) => (
                  <motion.div
                    key={`${file.path}-${file.timestamp}`}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50"
                  >
                    <div
                      className={`p-1 rounded ${
                        file.action === "write"
                          ? "text-orange-500 bg-orange-500/10"
                          : "text-yellow-500 bg-yellow-500/10"
                      }`}
                    >
                      {file.action === "write" ? (
                        <Pencil className="h-3 w-3" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                    </div>
                    <span className="flex-1 text-sm truncate font-mono">
                      {getFileName(file.path)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(file.timestamp)}
                    </span>
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

function getFileName(path: string): string {
  return path.split("/").pop() || path;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
