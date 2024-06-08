import fs from "fs";
import { JackTokenizer } from "./jackTokenizer";
import { TokenType } from "./types/tokenType";

export class JackAnalyzer {
  private readonly filepath: string;
  private readonly tokenizer: JackTokenizer;
  private constructor(filepath: string) {
    const content = fs.readFileSync(filepath, "utf-8");
    this.tokenizer = JackTokenizer.init(content);
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
    const tokensFilePath = this.filepath.replace(".jack", "T.xml");
    const tokensWriteStream = fs.createWriteStream(tokensFilePath);
    tokensWriteStream.write("<tokens>\n");
    while (this.tokenizer.hasMoreTokens()) {
      const tokenType = this.tokenizer.tokenType();
      let value: string;
      switch (tokenType) {
        case "KEYWORD":
          value = this.tokenizer.keyword();
          break;
        case "SYMBOL":
          value = this.tokenizer.symbol();
          break;
        case "IDENTIFIER":
          value = this.tokenizer.identifier();
          break;
        case "INT_CONST":
          value = this.tokenizer.intVal().toString();
          break;
        case "STRING_CONST":
          value = this.tokenizer.stringVal();
          break;
        default:
          throw new Error("Invalid token type");
      }
      tokensWriteStream.write(
        `<${tokenType.toLowerCase()}> ${value} </${tokenType.toLowerCase()}>\n`
      );
      this.tokenizer.advance();
    }
    tokensWriteStream.write("</tokens>\n");
  }
}

// 方針1: analyzerの中でtokenizerでトークンを一つずつ呼び出し、それをcompilationEngineに渡す
// // メリット: トークンを一つずつ処理するので、トークンの種類に応じて処理を変えやすい
// // デメリット: トークンの種類に応じた処理をcompilationEngineに書かないといけない & トークンの種類に応じて処理を呼び出すのでjack analyzerの中でif文が多くなる
// 方針2: compileEngineの中でtokenizerを呼び出し、tokenizerからトークンを一つずつ取得する
// // メリット: トークンの種類に応じた処理をcompilationEngineに書ける & jack analyzerの中でif文が少なくなる
// // デメリット: compileEngineはtokenizerに依存してしまう
// 方針3: tokenizerを受け取ってcompileEngineの処理を出しわけする層を作る
// // メリット: tokenizerとcompileEngineの依存をなくすことができる
