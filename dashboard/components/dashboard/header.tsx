"use client";

import { useDashboardStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "motion/react";
import { Wifi, WifiOff, Settings, Moon, Sun, RefreshCw } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface DashboardHeaderProps {
  onReconnect?: () => void;
}

export function DashboardHeader({ onReconnect }: DashboardHeaderProps) {
  const { connected, session } = useDashboardStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                M
              </span>
            </div>
            <span className="font-semibold text-lg">Morty Dashboard</span>
          </motion.div>

          {/* Connection Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Badge
              variant={connected ? "default" : "destructive"}
              className="gap-1"
            >
              {connected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  Disconnected
                </>
              )}
            </Badge>
          </motion.div>
        </div>

        {/* Session Info / Actions */}
        <div className="flex items-center gap-2">
          {session && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Badge variant="outline">{session.engine}</Badge>
              <span className="hidden sm:inline">{session.mode} mode</span>
            </motion.div>
          )}

          {!connected && onReconnect && (
            <Button variant="outline" size="sm" onClick={onReconnect}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Reconnect
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
