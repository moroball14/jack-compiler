import { TokenType } from "./types/tokenType";

export class JackTokenizer {
  private readonly tokens: string[];
  private currentIndex = 0;
  private constructor(content: string) {
    const trimmedCommentContent = content.replace(/\/\/.*$/gm, "");
    this.tokens = trimmedCommentContent.split(/\s+/);
  }

  public static init(content: string) {
    return new JackTokenizer(content);
  }

  advance(): boolean {
    console.log(this.tokens);
    if (this.tokens[this.currentIndex + 1]) {
      this.currentIndex++;
      return true;
    }
    return false;
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
}
