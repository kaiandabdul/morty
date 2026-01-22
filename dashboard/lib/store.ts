import { create } from "zustand";

// Event types from CLI
export type EventType =
  | "session:start"
  | "session:end"
  | "task:start"
  | "task:complete"
  | "task:fail"
  | "step:update"
  | "file:read"
  | "file:write"
  | "command:run"
  | "tokens:update";

export interface MortyEvent {
  id: string;
  type: EventType;
  timestamp: number;
  data: Record<string, unknown>;
}

export interface TaskInfo {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "failed";
  startTime?: number;
  endTime?: number;
  error?: string;
}

export interface SessionInfo {
  id: string;
  startTime: number;
  engine: string;
  mode: "single" | "prd" | "parallel";
  workDir: string;
}

export interface TokenStats {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
}

export interface DashboardState {
  // Connection
  connected: boolean;
  wsUrl: string;

  // Session
  session: SessionInfo | null;

  // Tasks
  tasks: TaskInfo[];
  currentTask: TaskInfo | null;

  // Current step
  currentStep: string;

  // Events timeline
  events: MortyEvent[];

  // Token stats
  tokens: TokenStats;

  // Files being modified
  recentFiles: { path: string; action: "read" | "write"; timestamp: number }[];

  // Actions
  setConnected: (connected: boolean) => void;
  setWsUrl: (url: string) => void;
  setSession: (session: SessionInfo | null) => void;
  addTask: (task: TaskInfo) => void;
  updateTask: (id: string, updates: Partial<TaskInfo>) => void;
  setCurrentTask: (task: TaskInfo | null) => void;
  setCurrentStep: (step: string) => void;
  addEvent: (event: MortyEvent) => void;
  updateTokens: (tokens: Partial<TokenStats>) => void;
  addRecentFile: (file: { path: string; action: "read" | "write" }) => void;
  reset: () => void;
}

const initialState = {
  connected: false,
  wsUrl: "ws://localhost:3847",
  session: null,
  tasks: [],
  currentTask: null,
  currentStep: "Idle",
  events: [],
  tokens: { inputTokens: 0, outputTokens: 0, estimatedCost: 0 },
  recentFiles: [],
};

export const useDashboardStore = create<DashboardState>((set) => ({
  ...initialState,

  setConnected: (connected) => set({ connected }),
  setWsUrl: (wsUrl) => set({ wsUrl }),
  setSession: (session) => set({ session }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  setCurrentTask: (currentTask) => set({ currentTask }),
  setCurrentStep: (currentStep) => set({ currentStep }),

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 100), // Keep last 100 events
    })),

  updateTokens: (tokens) =>
    set((state) => ({
      tokens: { ...state.tokens, ...tokens },
    })),

  addRecentFile: (file) =>
    set((state) => ({
      recentFiles: [
        { ...file, timestamp: Date.now() },
        ...state.recentFiles,
      ].slice(0, 20), // Keep last 20 files
    })),

  reset: () => set(initialState),
}));
