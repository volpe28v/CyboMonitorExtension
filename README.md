# CyboMonitorExtension

Cybozuの更新をポップアップに表示する ChromeExtension

## 対応機能
* 「報告書」の新規追加とコメント追加の件数をバッジで表示
* 「報告書」の新規追加とコメント追加をポップアップで一覧表示
* ポップアップ上の一覧から更新されたページを開く

## 使い方
* サイボウズにログイン
* CyboMonitor をDLし、manifest.json の "permissions" をお使いのサイボウズの URL に書き換える
 * ex) https://xxxx.cybozu.com/x/
* Chrome の「設定」->「拡張機能」から「パッケージ化されていない拡張機能を読み込む」で CyboMonitor を読み込む
* 表示されたアイコンをクリックしてお使いのサイボウズURLを入力して「update」をクリック
 * ex) https://xxxx.cybozu.com/x/
* 「報告書」に未読(新規報告書、新規コメント)があればポップアップに表示される
* 「update」をクリックするか、一定時間(デフォルトは1分)で自動更新される
