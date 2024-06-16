import fs from "fs";
import { JackTokenizer } from "./jackTokenizer";
import { CompilationEngine } from "./compilationEngine";

export class JackAnalyzer {
  private readonly filepath: string;
  private constructor(filepath: string) {
    this.filepath = filepath;
  }

  public static init(filepath: string) {
    if (!filepath.endsWith(".jack")) {
      console.error(`${filepath} is not a .jack file`);
      process.exit(1);
    }
    return new JackAnalyzer(filepath);
  }

  handle() {
    // T.xmlの中間ファイルを生成
    const tokensFilePath = this.filepath.replace(".jack", "T.xml");
    const jackContent = fs.readFileSync(this.filepath, "utf-8");
    const tokensWriteStream = fs.createWriteStream(tokensFilePath);
    const tokenizer = JackTokenizer.init(jackContent, tokensWriteStream);
    tokenizer.handle();
    // コンパイル
    const compiledFilePath = tokensFilePath.replace("T.xml", ".xml");
    const tXmlContent = fs.readFileSync(tokensFilePath, "utf-8");
    const compilerWriteStream = fs.createWriteStream(compiledFilePath);
    const compilationEngine = CompilationEngine.init({
      content: tXmlContent,
      writeStream: compilerWriteStream,
    });
    compilationEngine.compileClass();
  }
}
