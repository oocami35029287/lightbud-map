# 世界圖誌 v1／Session 04

正式目錄與 Pages 入口保持不變；index.html 是首頁，map.html 是艾菲拉地圖，white.html 是白域圖誌。開發分支經 PR 審核，作者確認後才合併 main。

## 更新位置

- content/public-policy.json：核准公開欄位、精簡摘錄、來源版本與 A 級補充決策。禁止將工作稿整份搬入。沒有納入白名單的內容不輸出。
- tools/build-public.cjs：唯讀解析本機正式法典，產生 modules 各分類、catalog、relations 與 canon.js 相容橋接。原始法典保存在私人來源 repo，不放在網站 repo 或 dist。
- modules/catalog.json：生成資料唯一查詢入口；分類 JSON 由同一建置生成，不得手改世界設定。
- modules/coordinates.json：美術座標基準 1538 × 1022；不是量測地理。疊图大小只表示畫面配置，不是空間真實比例。
- modules/connections.json：只保留正式實體交通與生命功能關係；road、life、structure 狀態分別判斷。unassessed 表示未評估，不當作開通或封閉。
- modules/assets.json：圖片 manifest。assets.js、layout.js、connections.js 是地圖同步橋接，驗證器檢查與 JSON 一致。
- ui/site.js：導航、圖片、資料讀取與 ID 路由；ui/pages.js：圖鑑、搜尋、詳細面板、關係視圖與首頁。
- theme.css：共用主题；pages.css：圖誌／首頁；style.css：沿用地圖專用樣式。

## 可重複執行流程

1. 讀取 GitHub main 世界法典與 Drive 最新 A；版本或範圍衝突先記錄，不自動採用 C/B。
2. `node tools/compare-source.cjs <本機法典>`：產生已公開欄位的差異清單；不公開新正文。
3. 人工審核公開白名單、摘錄、來源 revision／sha256 與 supplemental A。禁止用關鍵字測試替代語義審核。
4. `node tools/build-public.cjs <本機法典>`：來源 hash 必須符合已審核 policy，生成公開資料與 content/diff-report.json。
5. `npm run check`、`npm run build`；安裝 Playwright 後 `npm run test:browser`。
6. PR 內審核內容 Diff、圖像配置、來源差異及測試報告。GitHub workflow 僅驗證與上傳可下載 artifact，不直接發布。
7. 作者審核合併後，既有 GitHub Pages main/root 更新同一網址。

## 位置編輯

地圖工具可以替換本次預覽底圖、拖曳場所、調整疊圖 X/Y/Width/Height/Opacity/zIndex/顯示。圖片與節點同一 SVG world 變換，縮放／拖曳同步。疊圖可獨立變更且不覆盖節點資料。

版本 3 JSON 帶 coordinateSystem、placements、routes、overlays、background；圖片檔不內嵌 JSON。舊版本 2 使用不同底圖，拒絕直接套用；須人工按新版參考圖遷移。匯入先完整驗證，再修改，避免錯誤檔案部分覆蓋。編輯僅本次瀏覽保留，匯出／載入不發布。

四座核心穩定器沿用地域實例 ID，但未提供精確 x/y，以區域資訊列查詢。群息之庭仍沿用 hollow-bud / GEO-011；名稱更動不換 ID。事件位置不在本版公開地圖。

## 素材保存

作者新素材以原檔名新增，原有 ephyra-base.png、ephyra-bible-v2.png、spore-chamber.png 在 GitHub 保留；不覆蓋、不删除。地圖_v1.png 僅標註參考，不能作為道路／設備座標的正典來源。菌王株.png 用於生態圖鑑，主底圖已有地表株，因此沒有重複疊加。

角色插畫只能引用核准作者素材。缺少定稿時保留可替換欄位，不生成新的角色設計。白域尚無核准底圖／座標，呈現正式世界資料而不虛構空間配置。
