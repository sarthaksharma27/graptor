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


