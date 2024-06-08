import fs from "fs";

export class JackAnalyzer {
  private readonly filepath: string;
  private constructor(filepath: string) {
    console.log("JackAnalyzer created");
    this.filepath = filepath;
  }

  public static init(filepath: string) {
    return new JackAnalyzer(filepath);
  }

  handle() {
    const content = fs.readFileSync(this.filepath, "utf-8");
    // todo: tokenizerを生成
    // todo: xxx.jackファイルに対応するxxx.xmlファイルを生成
    // todo: compilationEngineを生成
    // todo: compileしてxxx.xmlファイルへ書き込み
  }
}
