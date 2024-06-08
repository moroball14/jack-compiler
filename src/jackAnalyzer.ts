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
    this.tokenize(tokensFilePath);
  }

  private tokenize(tokensFilePath: string) {
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
      const lexicalElement = this.generateLexicalElement(tokenType);
      tokensWriteStream.write(
        `<${lexicalElement}> ${value} </${lexicalElement}>\n`
      );
      this.tokenizer.advance();
    }
    tokensWriteStream.write("</tokens>\n");
    tokensWriteStream.close();
  }

  private generateLexicalElement(tokenType: TokenType): string {
    if (tokenType === "INT_CONST") {
      return "integerConstant";
    }
    if (tokenType === "STRING_CONST") {
      return "stringConstant";
    }
    return tokenType.toLowerCase();
  }
}
