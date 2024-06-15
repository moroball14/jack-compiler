import fs from "fs";

// contentの例
// <tokens>
// <keyword> class </keyword>
// <identifier> Main </identifier>
// <symbol> { </symbol>
// <keyword> static </keyword>
// <keyword> boolean </keyword>
// <identifier> test </identifier>
// <symbol> ; </symbol>
// <keyword> function </keyword>
// <keyword> void </keyword>
// <identifier> main </identifier>
// <symbol> ( </symbol>
// <symbol> ) </symbol>
// <symbol> { </symbol>
// <keyword> var </keyword>
// <identifier> SquareGame </identifier>
// <identifier> game </identifier>
// <symbol> ; </symbol>
// <keyword> let </keyword>
// <identifier> game </identifier>
// <symbol> = </symbol>
// <identifier> game </identifier>
// <symbol> ; </symbol>
// <keyword> do </keyword>
// <identifier> game </identifier>
// <symbol> . </symbol>
// <identifier> run </identifier>
// <symbol> ( </symbol>
// <symbol> ) </symbol>
// <symbol> ; </symbol>
// <keyword> do </keyword>
// <identifier> game </identifier>
// <symbol> . </symbol>
// <identifier> dispose </identifier>
// <symbol> ( </symbol>
// <symbol> ) </symbol>
// <symbol> ; </symbol>
// <keyword> return </keyword>
// <symbol> ; </symbol>
// <symbol> } </symbol>
// <keyword> function </keyword>
// <keyword> void </keyword>
// <identifier> more </identifier>
// <symbol> ( </symbol>
// <symbol> ) </symbol>
// <symbol> { </symbol>
// <keyword> var </keyword>
// <keyword> boolean </keyword>
// <identifier> b </identifier>
// <symbol> ; </symbol>
// <keyword> if </keyword>
// <symbol> ( </symbol>
// <identifier> b </identifier>
// <symbol> ) </symbol>
// <symbol> { </symbol>
// <symbol> } </symbol>
// <keyword> else </keyword>
// <symbol> { </symbol>
// <symbol> } </symbol>
// <keyword> return </keyword>
// <symbol> ; </symbol>
// <symbol> } </symbol>
// <symbol> } </symbol>
// </tokens>

const KEYWORDS = {
  static: "<keyword> static </keyword>",
  field: "<keyword> field </keyword>",
};

const SYMBOLS = {
  comma: "<symbol> , </symbol>",
};

export class CompilationEngine {
  private readonly writeStream: fs.WriteStream;
  private tokens: string[];
  private indent: number = 0;
  private currentTokenIndex = 0;

  private constructor(args: { writeStream: fs.WriteStream; content: string }) {
    this.writeStream = args.writeStream;
    this.tokens = args.content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
  }

  public static init(args: { content: string; writeStream: fs.WriteStream }) {
    return new CompilationEngine(args);
  }

  compileClass() {
    this.writeStream.write("<class>\n");
    this.plusIndent();
    this.plusIndex();
    this.writeCurrentLine();
    this.writeCurrentLine();
    this.writeCurrentLine();
    this.compileClassVarDec();
    // this.compileSubroutineDec();
    this.writeCurrentLine(); // classの閉じタグが来る想定
    this.minusIndent();
    this.writeStream.write("</class>\n");
    this.writeStream.end();
  }

  private compileClassVarDec() {
    while (
      this.tokens[this.currentTokenIndex] === KEYWORDS.static ||
      this.tokens[this.currentTokenIndex] === KEYWORDS.field
    ) {
      this.writeStream.write(`${this.indentSpace()}<classVarDec>\n`);
      this.plusIndent();
      this.writeCurrentLine();
      this.writeCurrentLine();
      this.writeCurrentLine();
      while (this.tokens[this.currentTokenIndex] === SYMBOLS.comma) {
        this.writeCurrentLine();
        this.writeCurrentLine();
      }
      this.writeCurrentLine(); // ここが<symbol> ; </symbol>のはず
      this.minusIndent();
      this.writeStream.write(`${this.indentSpace()}</classVarDec>\n`);
    }
  }

  private plusIndent() {
    this.indent += 2;
  }

  private minusIndent() {
    this.indent -= 2;
  }

  private indentSpace() {
    return " ".repeat(this.indent);
  }

  private plusIndex() {
    this.currentTokenIndex++;
  }

  private writeCurrentLine() {
    this.writeStream.write(
      `${this.indentSpace()}${this.tokens[this.currentTokenIndex]}\n`
    );
    this.plusIndex();
  }
}
