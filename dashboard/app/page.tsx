"use client";

import { useWebSocket } from "@/lib/websocket";
import { ThemeProvider } from "@/components/theme-provider";
import {
  DashboardHeader,
  AgentMonitor,
  TaskList,
  EventTimeline,
  TokenStats,
  ProgressRing,
  RecentFiles,
} from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui/card";

function DashboardContent() {
  const { connect } = useWebSocket();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onReconnect={connect} />

      <main className="container mx-auto p-4 space-y-4">
        {/* Top row - Agent Status & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AgentMonitor />
          </div>
          <Card className="flex items-center justify-center">
            <CardContent className="pt-6">
              <ProgressRing size={140} />
            </CardContent>
          </Card>
        </div>

        {/* Token Stats */}
        <TokenStats />

        {/* Middle row - Tasks & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TaskList />
          <EventTimeline />
        </div>

        {/* Bottom row - Recent Files */}
        <RecentFiles />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ThemeProvider defaultTheme="dark">
      <DashboardContent />
    </ThemeProvider>
  );
}
