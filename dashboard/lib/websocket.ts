"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  useDashboardStore,
  type MortyEvent,
  type TaskInfo,
  type SessionInfo,
} from "./store";

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    wsUrl,
    connected,
    setConnected,
    setSession,
    addTask,
    updateTask,
    setCurrentTask,
    setCurrentStep,
    addEvent,
    updateTokens,
    addRecentFile,
    reset,
  } = useDashboardStore();

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as MortyEvent;

        // Add to events timeline
        addEvent(data);

        // Handle specific event types
        switch (data.type) {
          case "session:start":
            setSession(data.data as SessionInfo);
            break;

          case "session:end":
            setSession(null);
            break;

          case "task:start":
            const newTask: TaskInfo = {
              id: data.data.id as string,
              title: data.data.title as string,
              status: "running",
              startTime: data.timestamp,
            };
            addTask(newTask);
            setCurrentTask(newTask);
            setCurrentStep("Starting task...");
            break;

          case "task:complete":
            updateTask(data.data.id as string, {
              status: "completed",
              endTime: data.timestamp,
            });
            setCurrentTask(null);
            setCurrentStep("Idle");
            break;

          case "task:fail":
            updateTask(data.data.id as string, {
              status: "failed",
              endTime: data.timestamp,
              error: data.data.error as string,
            });
            setCurrentTask(null);
            setCurrentStep("Task failed");
            break;

          case "step:update":
            setCurrentStep(data.data.step as string);
            break;

          case "file:read":
            addRecentFile({
              path: data.data.path as string,
              action: "read",
            });
            break;

          case "file:write":
            addRecentFile({
              path: data.data.path as string,
              action: "write",
            });
            break;

          case "tokens:update":
            updateTokens({
              inputTokens: data.data.input as number,
              outputTokens: data.data.output as number,
              estimatedCost: data.data.cost as number,
            });
            break;
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    },
    [
      addEvent,
      setSession,
      addTask,
      updateTask,
      setCurrentTask,
      setCurrentStep,
      addRecentFile,
      updateTokens,
    ],
  );

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setConnected(true);
        console.log("Connected to Morty");
      };

      wsRef.current.onclose = () => {
        setConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onmessage = handleMessage;
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  }, [wsUrl, setConnected, handleMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setConnected(false);
    reset();
  }, [setConnected, reset]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { connected, connect, disconnect };
}
