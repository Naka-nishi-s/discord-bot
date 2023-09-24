/**
 * DB関連の処理をまとめている
 */

// DB接続
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./mydatabase.db");

/**
 * インサート処理
 * @param userId ユーザーID
 * @returns errText （エラーがあれば）エラーの内容を返す
 */
const insertUserId = (userId) => {
  // プレースホルダーを使用してインサートする
  db.run("INSERT INTO user (user_id) VALUES (?)", [userId], (err) => {
    // エラー報告用のテキスト
    let errText;

    if (err) {
      // エラーがあれば報告
      errText = "INSERT時のエラーです。管理者に相談してください。";
      return errText;
    } else {
      return errText;
    }
  });
};

/**
 * ユーザー全取得処理
 * @returns errMsg （エラーがあれば）エラーの内容を返す
 */
const selectAllUser = () => {
  return new Promise((resolve, reject) => {
    // 全ユーザーを取得
    db.all("SELECT * FROM user", (err, rows) => {
      if (err) {
        // エラーがあれば報告
        reject({
          errMsg:
            "抽選中、ユーザー全取得時のエラーです。\n管理者に相談してください。",
        });
      } else {
        // 問題なかったらデータを返す
        resolve({ data: rows });
      }
    });
  });
};

/**
 * ユーザーテーブルのクリーンアップ
 * @returns errMsg （エラーがあれば）エラーの内容を返す
 */
const cleanUserTable = () => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM user", (err) => {
      if (err) {
        reject({
          errMsg:
            "userテーブルのクリーンアップ時のエラーです。\n管理者に相談してください。",
        });
      } else {
        return null;
      }
    });
  });
};

module.exports = {
  insertUserId,
  selectAllUser,
  cleanUserTable,
};
