import os from "os";
import path from "path";
import fs from "fs";

export interface GraptorConfig {
  provider: string;
  model: string;
  apiKey: string; 
}

const CONFIG_DIR = path.join(os.homedir(), ".config", "graptor");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

console.log(CONFIG_DIR);
console.log(CONFIG_PATH);

export function saveConfig(config: GraptorConfig) {
  if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log(`Configuration saved at ${CONFIG_PATH}`);
}

export function loadConfig(): GraptorConfig | null {
  if (!fs.existsSync(CONFIG_PATH)) return null;
  try {
    const data = fs.readFileSync(CONFIG_PATH, "utf8");
    return JSON.parse(data) as GraptorConfig;
  } catch (e) {
    console.error("Failed to load config:", e);
    return null;
  }
}

