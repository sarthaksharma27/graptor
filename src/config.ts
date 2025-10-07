import os from "os";
import path from "path";

const CONFIG_DIR = path.join(os.homedir(), ".config", "graptor");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

console.log(CONFIG_DIR);
console.log(CONFIG_PATH);



