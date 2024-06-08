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
      { content: "class", expected: "class" },
      { content: "constructor", expected: "constructor" },
      { content: "function", expected: "function" },
      { content: "method", expected: "method" },
      { content: "field", expected: "field" },
      { content: "static", expected: "static" },
      { content: "var", expected: "var" },
      { content: "int", expected: "int" },
      { content: "char", expected: "char" },
      { content: "boolean", expected: "boolean" },
      { content: "void", expected: "void" },
      { content: "true", expected: "true" },
      { content: "false", expected: "false" },
      { content: "null", expected: "null" },
      { content: "this", expected: "this" },
      { content: "let", expected: "let" },
      { content: "do", expected: "do" },
      { content: "if", expected: "if" },
      { content: "else", expected: "else" },
      { content: "while", expected: "while" },
      { content: "return", expected: "return" },
    ])("should return %p when the token is %p", ({ content, expected }) => {
      const tokenizer = JackTokenizer.init(content);
      expect(tokenizer.keyword()).toBe(expected);
    });
  });
});
