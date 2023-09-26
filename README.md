# Qualification Milestones

## 概要

- Discord の Bot です。
- 取った資格を報告すると、マイルストーンが貯まります。
- マイルストーンが一定まで貯まると、抽選を行います。
- 抽選は資格取得者の中から 1 人選び、そのユーザー名を返します。
- 選ばれたユーザーにプレゼントを渡しましょう！

## 導入方法

0. [Discord のチャンネルに Bot を追加]("")
1. [Bot の初期設定]("")
2. [Bot の起動（常駐）]("")

### Discord のチャンネルに Bot を追加

Discord のデスクトップ版をダウンロードし、使用できるようにしておく。

ブラウザにて、URL の欄に以下を入力

```
URL
```

どのサーバーに Bot を導入するか選ぶ画面に飛ぶので、お好きなサーバーを選択し、導入。

### Bot の初期設定

当 Github からお好きな場所にソースを clone する。

clone したディレクトリの中に移動し、package.json がある階層で以下コマンドを入力

```
npm ci
```

続いて、同じ階層にて以下コマンド

```
node ./sqliteinit.js
```

### Bot の起動（常駐）

以下コマンドで Bot を起動。

```
node ./index.js
```

常駐させる場合は、VPS などをご使用ください。
