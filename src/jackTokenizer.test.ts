import { JackTokenizer } from "./jackTokenizer";
import { KeywordType } from "./types/keywordType";
import { TokenType } from "./types/tokenType";

describe("JackTokenizer", () => {
  describe("tokenType", () => {
    it.each<{ content: string; expected: TokenType }>([
      { content: "class", expected: "KEYWORD" },
      { content: "{", expected: "SYMBOL" },
      { content: "Main", expected: "IDENTIFIER" },
      { content: "4", expected: "INT_CONST" },
      { content: "3TIMES", expected: "STRING_CONST" },
    ])("should return %p when the token is %p", ({ content, expected }) => {
      const tokenizer = JackTokenizer.init(content);
      expect(tokenizer.tokenType()).toBe(expected);
    });
  });

  describe("keyword", () => {
    it.each<{ content: string; expected: KeywordType }>([
      { content: "class", expected: "CLASS" },
      { content: "constructor", expected: "CONSTRUCTOR" },
      { content: "function", expected: "FUNCTION" },
      { content: "method", expected: "METHOD" },
      { content: "field", expected: "FIELD" },
      { content: "static", expected: "STATIC" },
      { content: "var", expected: "VAR" },
      { content: "int", expected: "INT" },
      { content: "char", expected: "CHAR" },
      { content: "boolean", expected: "BOOLEAN" },
      { content: "void", expected: "VOID" },
      { content: "true", expected: "TRUE" },
      { content: "false", expected: "FALSE" },
      { content: "null", expected: "NULL" },
      { content: "this", expected: "THIS" },
      { content: "let", expected: "LET" },
      { content: "do", expected: "DO" },
      { content: "if", expected: "IF" },
      { content: "else", expected: "ELSE" },
      { content: "while", expected: "WHILE" },
      { content: "return", expected: "RETURN" },
    ])("should return %p when the token is %p", ({ content, expected }) => {
      const tokenizer = JackTokenizer.init(content);
      expect(tokenizer.keyword()).toBe(expected);
    });
  });
});
