# Session 04｜世界觀網站 v1 候審交付

狀態：工程候審，PR #1：https://github.com/oocami35029287/lightbud-map/pull/1 。開發分支 feat/session04-world-site；沒有合併 main、沒有發布正式新版，也沒有修改世界法典。

## 核對版本與既有工作

- lightbud-map/main 基準：17718f04ae13aa74e92c7567e969b326b16e2c6c，2026-10-11 14:03 UTC；沿用此版本的地理修正及原生 SVG 互動工程。
- lightbud-dream/main：世界法典 blob 34e13c8b765dddbaa9e02375fc5238c8271911cb；高地走廊 PR #2 的已合併 commit 1a6031917afc8f44543fb454a2556a8552b35a34。91 個正式 ID。
- 法典 SHA256：a5b5307d27feff761db37ce412b56f3672806d96ebc174774cce0ff216883894。
- 已讀專案章程、WORK_LOG、SOURCE_INDEX 及 BIBLE_CONTROL；舊索引的未合併狀態已由最新 main 覆蓋。
- Drive LB-070、LB-071 是最新作者 A；日期保留來源原有標記 2026-10-12，核對日期為本 Session 2026-10-11 UTC，不因標記日期自動採納其他內容。已逐段讀取地理專題與世界總索引的正式 A/C 界線。
- 本網站依作者本次公開範圍授權，僅收錄 LB-070 的群息之庭／獨立設備區關係及 LB-071 的菌王三形象區分，獨立記錄 supplement 來源；未反寫法典。概念圖比例、裝置形狀、迷宮精確走向等 C 不採用。
- main branch API 讀取 protected=false。PR workflow 是驗證措施；不宣稱有分支保護或強制審核。

## 改動與差異

| 範圍 | main 基準 | v1 候審版 |
| --- | --- | --- |
| 首頁 | 地圖 | 作者 ruin_p1_v5 沉浸式場景、視差、粒子、捲動探索 |
| 主要導覽 | 艾菲拉／白域 | 七頁統一導覽＋白域副頁 |
| 公開資料 | 41 筆地圖／事件摘錄，含 20 筆事件 | 63 筆逐欄位核准公開條目，0 筆事件 |
| 地圖標記 | 21 個（包含事件裂隙及設備示意座標） | 17 個場所標記＋4 個無精確座標核心設備區域資訊 |
| 地圖連線 | 15 條混合行程、功能、生物與修復順序 | 6 條有來源的交通／訊號／生物關係；狀態分型 |
| 圖片 | 舊底圖及孢室 | 新主底圖＋兩張可獨立編輯的疊圖；舊圖保留 |
| 座標基準 | 1536 × 1024 | 作者原圖真實比例 1538 × 1022 |
| 匯出 | version 2 | version 3、coordinateSystem、疊圖配置、完整驗證後匯入 |
| 維護 | canon/data/layout/app 初步分離 | 公開 policy、分類資料、關係、場所身分、座標、連線、圖片 manifest、共用 UI、CSS 分離 |

本輪作者追加：格蕾茲／弗蕾／瑟薇插畫未定稿，先不加入；小麻父親、母親從公開圖鑑、catalog、分類資料及關係引用中移除。原法典條目不變。璃璃與小麻使用已核對的 01_定案／設計定稿v1.png，完整展示設計板，不生成新造型。

## 工程與公開範圍

- index/world/map/characters/ecology/organizations/civilization 七頁完成；white.html 保留世界切換與白域正式簡介。
- 地圖原 app.js 拖曳、雙指縮放、滾輪、節點卡、搜尋與位置編輯保留；增加永久 ID 搜尋、鍵盤平移及跨頁進入指定場所。
- 生態條目、人物律別／所屬地、組織與地點引用同一 catalog；關係視圖有文字連結可供鍵盤使用。
- 組織、族群與職務提供獨立分類；聖蔭教會三方職責直接引用正式條目。
- 菌王株用於生態圖鑑，主地圖本身已有地表株，不重複覆蓋。
- 地圖_v1 僅參考標註。實體道路線表示已確認交通關係，虛線標明走向示意；沒有假定精確橋路、菌網管線或守脈機座標。
- 補充來源、永久 ID、資料狀態、可公開標記與來源 hash 逐筆保留。
- 原始法典／Drive 全文不進公開 repo 或 dist；故事、旅程、事件串鏈、修復箭頭、結局及劇透 UI／資料均排除。
- 原三張舊圖已逐張視覺檢查，沒有「菌路」舊文字；新作者圖片亦已檢視。程式詞義按連線 type 修改，沒有全域字串替換。

## 驗證結果

- npm run check：63 個唯一 ID、來源／公开狀態、跨頁引用、17 個場所、4 個核心、6 個關係、素材及相容橋接一致性、8 個路由／資源檢查通過。
- parser fixtures：重複 ID、缺失引用、未核准來源 hash 皆拒絕。
- npm run build：純靜態 dist 產物成功，原 Pages 子目錄保留。
- compare-source：核准版本 hash 相符，0 個缺失條目，0 個公開欄位差異。
- Chromium／Playwright：21 項檢查通過，1440px 桌面及 390px 手機；無 JS 錯誤、資源 404 或橫向溢出。
- 互動測試包含搜尋、詳細面板／Escape、關係模式、永久 ID 深連結、縮放、底圖與菌網獨立圖層、疊圖座標／顯示、匯出、匯入及原子拒絕錯誤匯入、手機拖曳／鍵盤平移、reduced-motion。
- GitHub PR CI 配置：資料驗證、建置、瀏覽器回歸、可下載 artifact；不排程讀 Drive、不自動 merge、不部署。遠端 CI 實際結果另依 PR checks 記錄。

## 限制與待審

- 新節點／疊圖美術對齊仍需作者檢視；所有坐標是美術呈現，不是地理測量。
- 未定稿角色插畫按作者最新指示留空；不影響人物資料或未來 manifest 替換。
- 白域沒有核准地理底圖或場所座標，現有 main 原本也是空白白域頁；本版提供正式世界資料，不假造地圖。
- 沒有核准的古代建築工程剖面，使用正式地理層級示意；不補未知技術原理。
- version 2 位置檔不直接套入新版底圖，需人工遷移；原檔仍可回退至舊 main 使用。
- 手機雙指處理沿用既有實作；已測單指拖曳與縮放按鈕，實體裝置雙指手勢仍建議作者驗看。
- 正式發布前作者審核內容、美術位置與補充 A 的採用範圍，再合併 PR。

## 測試版本使用

下載本次交付 ZIP 後在解壓根目錄執行 `python -m http.server 8000`；若使用 GitHub PR workflow 的 lightbud-world-site-review artifact，須先進入其中的 `dist/` 目錄，再執行同一指令。開啟 `http://localhost:8000/map-7bc96109b1fac0f0e3238baa38c5378d/`。ES Modules／JSON fetch 需 HTTP，不能直接 file:// 打開。

開發者從分支 checkout：`npm run check`、`npm run build`；瀏覽器測試需 Playwright 1.56.1 與 Chromium，先啟動 root 的 8765 HTTP server，再 `npm run test:browser`。可用 TEST_SITE_URL 和 CHROMIUM_PATH 指定環境。
