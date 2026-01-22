import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { type MortyConfig, MortyConfigSchema } from "./types.ts";

// New Morty directory constant
export const MORTY_DIR = ".morty";
// Legacy support for migration
export const RALPHY_DIR = ".ralphy";
export const CONFIG_FILE = "config.yaml";
export const PROGRESS_FILE = "progress.txt";

/**
 * Get the active config directory (prefers .morty, falls back to .ralphy)
 */
export function getActiveConfigDir(workDir = process.cwd()): string {
  const mortyDir = join(workDir, MORTY_DIR);
  const ralphyDir = join(workDir, RALPHY_DIR);

  // Prefer .morty if it exists
  if (existsSync(mortyDir)) {
    return MORTY_DIR;
  }
  // Fall back to .ralphy for backward compatibility
  if (existsSync(ralphyDir)) {
    return RALPHY_DIR;
  }
  // Default to .morty for new projects
  return MORTY_DIR;
}

/**
 * Get the full path to the morty directory
 */
export function getMortyDir(workDir = process.cwd()): string {
  return join(workDir, getActiveConfigDir(workDir));
}

// Alias for backward compatibility
export function getRalphyDir(workDir = process.cwd()): string {
  return getMortyDir(workDir);
}

/**
 * Get the full path to the config file
 */
export function getConfigPath(workDir = process.cwd()): string {
  return join(workDir, getActiveConfigDir(workDir), CONFIG_FILE);
}

/**
 * Get the full path to the progress file
 */
export function getProgressPath(workDir = process.cwd()): string {
  return join(workDir, getActiveConfigDir(workDir), PROGRESS_FILE);
}

/**
 * Check if morty is initialized in the directory
 */
export function isInitialized(workDir = process.cwd()): boolean {
  return existsSync(getConfigPath(workDir));
}

/**
 * Load the morty config from disk
 */
export function loadConfig(workDir = process.cwd()): MortyConfig | null {
  const configPath = getConfigPath(workDir);

  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const parsed = YAML.parse(content);
    return MortyConfigSchema.parse(parsed);
  } catch (error) {
    // Return default config if parsing fails
    return MortyConfigSchema.parse({});
  }
}

/**
 * Get rules from config
 */
export function loadRules(workDir = process.cwd()): string[] {
  const config = loadConfig(workDir);
  return config?.rules ?? [];
}

/**
 * Get boundaries from config
 */
export function loadBoundaries(workDir = process.cwd()): string[] {
  const config = loadConfig(workDir);
  return config?.boundaries.never_touch ?? [];
}

/**
 * Get test command from config
 */
export function loadTestCommand(workDir = process.cwd()): string {
  const config = loadConfig(workDir);
  return config?.commands.test ?? "";
}

/**
 * Get lint command from config
 */
export function loadLintCommand(workDir = process.cwd()): string {
  const config = loadConfig(workDir);
  return config?.commands.lint ?? "";
}

/**
 * Get build command from config
 */
export function loadBuildCommand(workDir = process.cwd()): string {
  const config = loadConfig(workDir);
  return config?.commands.build ?? "";
}

/**
 * Get project context as a formatted string
 */
export function loadProjectContext(workDir = process.cwd()): string {
  const config = loadConfig(workDir);
  if (!config) return "";

  const parts: string[] = [];
  if (config.project.name) parts.push(`Project: ${config.project.name}`);
  if (config.project.language)
    parts.push(`Language: ${config.project.language}`);
  if (config.project.framework)
    parts.push(`Framework: ${config.project.framework}`);
  if (config.project.description)
    parts.push(`Description: ${config.project.description}`);

  return parts.join("\n");
}
