import fs from "fs";

const KEYWORDS = {
  static: "<keyword> static </keyword>",
  field: "<keyword> field </keyword>",
  function: "<keyword> function </keyword>",
  constructor: "<keyword> constructor </keyword>",
  method: "<keyword> method </keyword>",
  var: "<keyword> var </keyword>",
  let: "<keyword> let </keyword>",
  if: "<keyword> if </keyword>",
  while: "<keyword> while </keyword>",
  do: "<keyword> do </keyword>",
  return: "<keyword> return </keyword>",
  else: "<keyword> else </keyword>",
};

const SYMBOLS = {
  comma: "<symbol> , </symbol>",
  semicolon: "<symbol> ; </symbol>",
  openParen: "<symbol> ( </symbol>",
  closeParen: "<symbol> ) </symbol>",
  openBracket: "<symbol> [ </symbol>",
  closeBracket: "<symbol> ] </symbol>",
  openBrace: "<symbol> { </symbol>",
  closeBrace: "<symbol> } </symbol>",
  plus: "<symbol> + </symbol>",
  minus: "<symbol> - </symbol>",
  star: "<symbol> * </symbol>",
  slash: "<symbol> / </symbol>",
  ampersand: "<symbol> &amp; </symbol>",
  verticalBar: "<symbol> | </symbol>",
  lessThan: "<symbol> &lt; </symbol>",
  greaterThan: "<symbol> &gt; </symbol>",
  equal: "<symbol> = </symbol>",
  tilde: "<symbol> ~ </symbol>",
  dot: "<symbol> . </symbol>",
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
    this.compileSubroutineDec();
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
      this.writeCurrentLine(); // ; が来る
      this.minusIndent();
      this.writeStream.write(`${this.indentSpace()}</classVarDec>\n`);
    }
  }

  private compileSubroutineDec() {
    while (
      this.tokens[this.currentTokenIndex] === KEYWORDS.function ||
      this.tokens[this.currentTokenIndex] === KEYWORDS.method ||
      this.tokens[this.currentTokenIndex] === KEYWORDS.constructor
    ) {
      this.writeStream.write(`${this.indentSpace()}<subroutineDec>\n`);
      this.plusIndent();
      this.writeCurrentLine();
      this.writeCurrentLine();
      this.writeCurrentLine();
      this.writeCurrentLine(); // ここは `(`
      this.compileParameterList();
      this.writeCurrentLine(); // ここは `)`
      this.compileSubroutineBody();
      this.minusIndent();
      this.writeStream.write(`${this.indentSpace()}</subroutineDec>\n`);
    }
  }

  private compileParameterList() {
    this.writeStream.write(`${this.indentSpace()}<parameterList>\n`);
    this.plusIndent();
    while (this.tokens[this.currentTokenIndex] !== SYMBOLS.closeParen) {
      this.writeCurrentLine();
      this.writeCurrentLine();
      if (this.tokens[this.currentTokenIndex] === SYMBOLS.comma) {
        this.writeCurrentLine();
      }
    }
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</parameterList>\n`);
  }

  private compileSubroutineBody() {
    this.writeStream.write(`${this.indentSpace()}<subroutineBody>\n`);
    this.plusIndent();
    this.writeCurrentLine(); // `{`
    this.compileVarDec();
    this.compileStatements();
    this.writeCurrentLine(); // `}`
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</subroutineBody>\n`);
  }

  private compileVarDec() {
    while (this.tokens[this.currentTokenIndex] === KEYWORDS.var) {
      this.writeStream.write(`${this.indentSpace()}<varDec>\n`);
      this.plusIndent();
      this.writeCurrentLine();
      this.writeCurrentLine();
      this.writeCurrentLine();
      while (this.tokens[this.currentTokenIndex] === SYMBOLS.comma) {
        this.writeCurrentLine();
        this.writeCurrentLine();
      }
      this.writeCurrentLine(); // `;`
      this.minusIndent();
      this.writeStream.write(`${this.indentSpace()}</varDec>\n`);
    }
  }

  private compileStatements() {
    this.writeStream.write(`${this.indentSpace()}<statements>\n`);
    this.plusIndent();
    while (
      this.tokens[this.currentTokenIndex] === KEYWORDS.let ||
      this.tokens[this.currentTokenIndex] === KEYWORDS.if ||
      this.tokens[this.currentTokenIndex] === KEYWORDS.while ||
      this.tokens[this.currentTokenIndex] === KEYWORDS.do ||
      this.tokens[this.currentTokenIndex] === KEYWORDS.return
    ) {
      switch (this.tokens[this.currentTokenIndex]) {
        case KEYWORDS.let:
          this.compileLetStatement();
          break;
        case KEYWORDS.if:
          this.compileIfStatement();
          break;
        case KEYWORDS.while:
          this.compileWhileStatement();
          break;
        case KEYWORDS.do:
          this.compileDoStatement();
          break;
        case KEYWORDS.return:
          this.compileReturnStatement();
          break;
      }
    }
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</statements>\n`);
  }

  private compileLetStatement() {
    this.writeStream.write(`${this.indentSpace()}<letStatement>\n`);
    this.plusIndent();
    this.writeCurrentLine();
    this.writeCurrentLine();
    if (this.tokens[this.currentTokenIndex] === SYMBOLS.openBracket) {
      this.writeCurrentLine();
      this.compileExpression();
      this.writeCurrentLine(); // ] が来るはず
    }
    this.writeCurrentLine(); // `=`
    this.compileExpression();
    this.writeCurrentLine(); // `;`
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</letStatement>\n`);
  }

  private compileIfStatement() {
    this.writeStream.write(`${this.indentSpace()}<ifStatement>\n`);
    this.plusIndent();
    this.writeCurrentLine();
    this.writeCurrentLine(); // `(`
    this.compileExpression();
    this.writeCurrentLine(); // `)`
    this.writeCurrentLine(); // `{`
    this.compileStatements();
    this.writeCurrentLine(); // `}`
    if (this.tokens[this.currentTokenIndex] === KEYWORDS.else) {
      this.writeCurrentLine();
      this.writeCurrentLine(); // `{`
      this.compileStatements();
      this.writeCurrentLine(); // `}`
    }
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</ifStatement>\n`);
  }

  private compileWhileStatement() {
    this.writeStream.write(`${this.indentSpace()}<whileStatement>\n`);
    this.plusIndent();
    this.writeCurrentLine();
    this.writeCurrentLine(); // `(`
    this.compileExpression();
    this.writeCurrentLine(); // `)`
    this.writeCurrentLine(); // `{`
    this.compileStatements();
    this.writeCurrentLine(); // `}`
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</whileStatement>\n`);
  }

  private compileDoStatement() {
    this.writeStream.write(`${this.indentSpace()}<doStatement>\n`);
    this.plusIndent();
    this.writeCurrentLine();
    this.compileSubroutineCall();
    this.writeCurrentLine(); // `;`
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</doStatement>\n`);
  }

  private compileReturnStatement() {
    this.writeStream.write(`${this.indentSpace()}<returnStatement>\n`);
    this.plusIndent();
    this.writeCurrentLine();
    if (this.tokens[this.currentTokenIndex] !== SYMBOLS.semicolon) {
      this.compileExpression();
    }
    this.writeCurrentLine(); // `;`
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</returnStatement>\n`);
  }

  private compileExpression() {
    this.writeStream.write(`${this.indentSpace()}<expression>\n`);
    this.plusIndent();
    this.compileTerm();
    while (
      this.tokens[this.currentTokenIndex] === SYMBOLS.plus ||
      this.tokens[this.currentTokenIndex] === SYMBOLS.minus ||
      this.tokens[this.currentTokenIndex] === SYMBOLS.star ||
      this.tokens[this.currentTokenIndex] === SYMBOLS.slash ||
      this.tokens[this.currentTokenIndex] === SYMBOLS.ampersand ||
      this.tokens[this.currentTokenIndex] === SYMBOLS.verticalBar ||
      this.tokens[this.currentTokenIndex] === SYMBOLS.lessThan ||
      this.tokens[this.currentTokenIndex] === SYMBOLS.greaterThan ||
      this.tokens[this.currentTokenIndex] === SYMBOLS.equal
    ) {
      this.writeCurrentLine();
      this.compileTerm();
    }
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</expression>\n`);
  }

  private compileTerm() {
    this.writeStream.write(`${this.indentSpace()}<term>\n`);
    this.plusIndent();
    if (this.tokens[this.currentTokenIndex] === SYMBOLS.openParen) {
      this.writeCurrentLine();
      this.compileExpression();
      this.writeCurrentLine(); // `)`
    } else if (
      this.tokens[this.currentTokenIndex] === SYMBOLS.minus ||
      this.tokens[this.currentTokenIndex] === SYMBOLS.tilde
    ) {
      this.writeCurrentLine();
      this.compileTerm();
    } else if (
      this.tokens[this.currentTokenIndex + 1] === SYMBOLS.openParen ||
      this.tokens[this.currentTokenIndex + 1] === SYMBOLS.dot
    ) {
      this.compileSubroutineCall();
    } else if (
      this.tokens[this.currentTokenIndex + 1] === SYMBOLS.openBracket
    ) {
      this.writeCurrentLine();
      this.writeCurrentLine(); // `[`
      this.compileExpression();
      this.writeCurrentLine(); // `]`
    } else {
      this.writeCurrentLine();
    }
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</term>\n`);
  }

  private compileSubroutineCall() {
    this.writeCurrentLine();
    if (this.tokens[this.currentTokenIndex] === SYMBOLS.dot) {
      this.writeCurrentLine();
      this.writeCurrentLine(); // subroutineName
      this.writeCurrentLine(); // `(`
      this.compileExpressionList();
      this.writeCurrentLine(); // `)`
    } else {
      // 厳密にはthis.tokens[this.currentTokenIndex] === SYMBOLS.openParen
      this.writeCurrentLine(); // `(`
      this.compileExpressionList();
      this.writeCurrentLine(); // `)`
    }
  }

  private compileExpressionList() {
    this.writeStream.write(`${this.indentSpace()}<expressionList>\n`);
    this.plusIndent();
    while (this.tokens[this.currentTokenIndex] !== SYMBOLS.closeParen) {
      this.compileExpression();
      if (this.tokens[this.currentTokenIndex] === SYMBOLS.comma) {
        this.writeCurrentLine();
      }
    }
    this.minusIndent();
    this.writeStream.write(`${this.indentSpace()}</expressionList>\n`);
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
