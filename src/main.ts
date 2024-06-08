import { JackAnalyzer } from "./jack-analyzer";

// 「ts-node main.ts xxxx」のxxxxでディレクトリ名またはファイル名を受け取るmain関数
function main() {
  // 引数を受け取る
  const args = process.argv.slice(2);
  // 引数がない場合はエラーを出力
  if (args.length === 0) {
    console.error("引数がありません");
    process.exit(1);
  }

  const jackAnalyzer = JackAnalyzer.init(args[0]);
  jackAnalyzer.handle();
}

main();
