# 光芽之夢｜世界圖誌

唯一正式網站目錄：`map-7bc96109b1fac0f0e3238baa38c5378d/`。

正式網址：https://oocami35029287.github.io/lightbud-map/map-7bc96109b1fac0f0e3238baa38c5378d/

Session 04 v1 開發分支包含七頁圖誌、獨立 Atlas 與公開資料建置。合併 main 後才由既有 Pages 更新。

- [候審差異與測試報告](reports/SESSION04.md)
- [更新及地圖編輯規則](map-7bc96109b1fac0f0e3238baa38c5378d/EDITING.md)
- [瀏覽器測試記錄](reports/browser-results.json)

`npm run check` 驗證公開條目、引用、來源及路徑；`npm run build` 產生純靜態 dist。網站預覽需 HTTP server，例如 `python -m http.server 8000`。

本工程不儲存世界法典原文、不自動讀取 Drive 草稿，也不自動發布新設定。資料更新先讀正式 main Bible、比對、審核白名單，再建置及提出 PR。
