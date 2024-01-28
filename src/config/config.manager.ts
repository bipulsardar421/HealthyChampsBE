import { ConfigInterface } from "./config";
import * as nconf from "nconf";

export class ConfigManager {
  private configuration: ConfigInterface;

  constructor() {
    this.init();
  }

  public get config(): ConfigInterface {
    return this.configuration;
  }

  private init() {
    nconf.use("memory");

    if (!nconf.get("info")) {
      this.getFile();
    }
    this.configuration = nconf.get();
    nconf.required(["port"]);
  }

  private getFile(): void {
    nconf.env(["NODE_ENV"]).file("default", {
      file: "default.json",
      dir: "env",
      type: "json",
      search: true,
    });
    const filename = `${process.env.NODE_ENV}.json`;
    nconf.file({
      file: filename,
      dir: "env",
      search: true,
      type: "json",
    });
  }
}
