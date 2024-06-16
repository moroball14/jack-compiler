import fs from "fs";
import { KeywordType } from "./types/keywordType";
import { TokenType } from "./types/tokenType";

export class JackTokenizer {
  private readonly tokens: string[];
  private readonly writeStream: fs.WriteStream;
  private currentIndex = 0;
  private constructor(content: string, writeStream: fs.WriteStream) {
    this.writeStream = writeStream;
    const trimmedCommentContent = content
      // // から行末までのコメントを削除
      .replace(/\/\/.*$/gm, "")
      // /** Expressionless version of projects/10/Square/Main.jack. */ というコメントもあるので、
      // /** と */ で囲まれたコメントを削除する
      .replace(/\/\*[\s\S]*?\*\//g, "");
    this.tokens = trimmedCommentContent
      // ダブルクォートで囲まれた文字列 or \s+を区切り文字
      .split(/(".*?"|\s+)/)
      // 上記に加えて’{’|’}’|’(’|’)’|’[’|’]’|’.’| ’,’ | ’;’ | ’+’ | ’-’ | ’*’ | ’/’ | ’&’ | ’|’ | ’<’ | ’>’ | ’=’ | ’~’ も区切り文字として扱う
      .flatMap((token) =>
        token.split(/({|}|\(|\)|\[|\]|\.|,|;|\+|-|\*|\/|&|\||<|>|=|~)/)
      )
      .filter((token) => token.trim() !== "");
  }

  public static init(content: string, writeStream: fs.WriteStream) {
    return new JackTokenizer(content, writeStream);
  }

  handle() {
    console.log(this.tokens);
    this.writeStream.write("<tokens>\n");
    while (this.hasMoreTokens()) {
      const tokenType = this.tokenType();
      let value: string;
      switch (tokenType) {
        case "KEYWORD":
          value = this.keyword();
          break;
        case "SYMBOL":
          value = this.symbol();
          break;
        case "IDENTIFIER":
          value = this.identifier();
          break;
        case "INT_CONST":
          value = this.intVal().toString();
          break;
        case "STRING_CONST":
          value = this.stringVal();
          break;
        default:
          throw new Error("Invalid token type");
      }
      const lexicalElement = this.generateLexicalElement(tokenType);
      this.writeStream.write(
        `<${lexicalElement}> ${value} </${lexicalElement}>\n`
      );
      this.advance();
    }
    this.writeStream.write("</tokens>\n");
    this.writeStream.close();
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

  hasMoreTokens(): boolean {
    return this.tokens[this.currentIndex] !== undefined;
  }

  advance() {
    this.currentIndex++;
  }

  tokenType(): TokenType {
    const token = this.tokens[this.currentIndex];
    if (
      token === "class" ||
      token === "constructor" ||
      token === "function" ||
      token === "method" ||
      token === "field" ||
      token === "static" ||
      token === "var" ||
      token === "int" ||
      token === "char" ||
      token === "boolean" ||
      token === "void" ||
      token === "true" ||
      token === "false" ||
      token === "null" ||
      token === "this" ||
      token === "let" ||
      token === "do" ||
      token === "if" ||
      token === "else" ||
      token === "while" ||
      token === "return"
    ) {
      return "KEYWORD";
    } else if (
      token === "{" ||
      token === "}" ||
      token === "(" ||
      token === ")" ||
      token === "[" ||
      token === "]" ||
      token === "." ||
      token === "," ||
      token === ";" ||
      token === "+" ||
      token === "-" ||
      token === "*" ||
      token === "/" ||
      token === "&" ||
      token === "|" ||
      token === "<" ||
      token === ">" ||
      token === "=" ||
      token === "~"
    ) {
      return "SYMBOL";
    } else if (token.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      return "IDENTIFIER";
    } else if (token.match(/^\d+$/)) {
      return "INT_CONST";
    } else if (token.match(/[^\\"\n\r]+/u)) {
      return "STRING_CONST";
    } else {
      throw new Error("Invalid token");
    }
  }

  keyword(): KeywordType {
    const token = this.tokens[this.currentIndex];
    if (token === "class") {
      return "class";
    } else if (token === "constructor") {
      return "constructor";
    } else if (token === "function") {
      return "function";
    } else if (token === "method") {
      return "method";
    } else if (token === "field") {
      return "field";
    } else if (token === "static") {
      return "static";
    } else if (token === "var") {
      return "var";
    } else if (token === "int") {
      return "int";
    } else if (token === "char") {
      return "char";
    } else if (token === "boolean") {
      return "boolean";
    } else if (token === "void") {
      return "void";
    } else if (token === "true") {
      return "true";
    } else if (token === "false") {
      return "false";
    } else if (token === "null") {
      return "null";
    } else if (token === "this") {
      return "this";
    } else if (token === "let") {
      return "let";
    } else if (token === "do") {
      return "do";
    } else if (token === "if") {
      return "if";
    } else if (token === "else") {
      return "else";
    } else if (token === "while") {
      return "while";
    } else if (token === "return") {
      return "return";
    } else {
      throw new Error("Invalid keyword");
    }
  }

  symbol(): string {
    const symbol = this.tokens[this.currentIndex];
    if (symbol === "<") {
      return "&lt;";
    }
    if (symbol === ">") {
      return "&gt;";
    }
    if (symbol === "&") {
      return "&amp;";
    }
    return symbol;
  }

  identifier(): string {
    return this.tokens[this.currentIndex];
  }

  intVal(): number {
    return Number(this.tokens[this.currentIndex]);
  }

  stringVal(): string {
    // 先頭と末尾のダブルクォートを除去して返す
    return this.tokens[this.currentIndex].replace(/^"|"$/g, "");
  }
}
