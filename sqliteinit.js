// モジュールのインポート。verboseは詳細なログを出力する為のもの。
const sqlite3 = require("sqlite3").verbose();

// DBファイルとしてmydatabase.dbを作成。データをここに保存。
const db = new sqlite3.Database("./mydatabase.db");

// 同期処理にする
db.serialize(() => {
  // userテーブルを作成
  db.run(
    "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, user_id TEXT) "
  );
});

db.close();
