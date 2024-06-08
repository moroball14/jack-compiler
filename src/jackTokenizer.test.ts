import { JackTokenizer } from "./jackTokenizer";
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
});
