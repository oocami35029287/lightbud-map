# 光芽之夢｜世界圖誌

唯一正式網站目錄：`map-7bc96109b1fac0f0e3238baa38c5378d/`。

正式網址：https://oocami35029287.github.io/lightbud-map/map-7bc96109b1fac0f0e3238baa38c5378d/

網站 v1 已於 2026 年 10 月 12 日經 PR #1 合併並由 GitHub Pages 發布。首頁、介紹圖誌與獨立 Atlas 共用原入口。

本輪更新介紹內容、角色頁、首頁故事入口、手機排版及分享資訊；Atlas 保留原版資料與程式。

- [v1 發布與歷史測試報告](reports/SESSION04.md)
- [更新及地圖編輯規則](map-7bc96109b1fac0f0e3238baa38c5378d/EDITING.md)
- [瀏覽器測試記錄](reports/browser-results.json)

`npm run check` 驗證公開條目、引用、來源及路徑；`npm run build` 產生純靜態 dist。網站預覽需 HTTP server，例如 `python -m http.server 8000`。

本工程不儲存世界法典原文、不自動讀取 Drive 草稿，也不自動發布新設定。資料更新先核對同版 main Bible MD／結構 JSON 與作者新 A、審核白名單，再建置及提出 PR。

- [本輪介紹更新與角色核對](reports/INTRO-20261110.md)
- 介紹資料：`modules/catalog.json`；地圖快照：`canon.js`，互相獨立。
- `content/atlas-baseline.json` 鎖定本輪排除的地圖依賴；任何意外改動會使驗證失敗。
