import { JackAnalyzer } from "./jackAnalyzer";
import fs from "fs";

function main() {
  // 引数を受け取る
  const args = process.argv.slice(2);
  // 引数がない場合はエラーを出力
  if (args.length === 0) {
    console.error("引数がありません");
    process.exit(1);
  }

  const path = args[0];

  recursiveHandler(path, compileJackFile);
}

function recursiveHandler(path: string, handler: (filepath: string) => void) {
  const stat = fs.statSync(path);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
      recursiveHandler(`${path}/${file}`, handler);
    });
  } else {
    handler(path);
  }
}

function compileJackFile(filepath: string) {
  if (!filepath.endsWith(".jack")) {
    console.log(`skip ${filepath}`);
    return;
  }
  const jackAnalyzer = JackAnalyzer.init(filepath);
  jackAnalyzer.handle();
}

main();
