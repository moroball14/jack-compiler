import { KeywordType } from "./types/keywordType";
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

  hasMoreTokens(): boolean {
    return !!this.tokens[this.currentIndex + 1];
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
      return "CLASS";
    } else if (token === "constructor") {
      return "CONSTRUCTOR";
    } else if (token === "function") {
      return "FUNCTION";
    } else if (token === "method") {
      return "METHOD";
    } else if (token === "field") {
      return "FIELD";
    } else if (token === "static") {
      return "STATIC";
    } else if (token === "var") {
      return "VAR";
    } else if (token === "int") {
      return "INT";
    } else if (token === "char") {
      return "CHAR";
    } else if (token === "boolean") {
      return "BOOLEAN";
    } else if (token === "void") {
      return "VOID";
    } else if (token === "true") {
      return "TRUE";
    } else if (token === "false") {
      return "FALSE";
    } else if (token === "null") {
      return "NULL";
    } else if (token === "this") {
      return "THIS";
    } else if (token === "let") {
      return "LET";
    } else if (token === "do") {
      return "DO";
    } else if (token === "if") {
      return "IF";
    } else if (token === "else") {
      return "ELSE";
    } else if (token === "while") {
      return "WHILE";
    } else if (token === "return") {
      return "RETURN";
    } else {
      throw new Error("Invalid keyword");
    }
  }
}
