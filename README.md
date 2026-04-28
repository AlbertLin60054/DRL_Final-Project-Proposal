# LibSignal：交通信號控制深度強化學習的標準化框架

[cite_start]本專案旨在解決交通信號控制（Traffic Signal Control, TSC）在深度強化學習（DRL）領域中所面臨的環境破碎與難以復現之問題 [cite: 1, 18, 23][cite_start]。透過 **LibSignal** 框架，我們實現了演算法與模擬器之間的解耦，確保實驗的科學嚴謹性與可重現性 [cite: 30, 33, 36]。

---

## 核心問題與背景

* [cite_start]**交通擁堵的成本**：在全球各大城市中，通勤者每年平均浪費超過 **100 小時** 在交通擁堵中 [cite: 8, 10, 11][cite_start]，造成巨大的經濟損失 [cite: 12, 13]。
* [cite_start]**傳統控制的侷限** [cite: 62]：
    * [cite_start]**定時控制 (Fixed-time)**：盲目依賴歷史平均流量，離峰時段易導致「無謂的紅燈等待」 [cite: 63]。
    * [cite_start]**感應控制 (Actuated)**：僅能針對局部交通動態反應，缺乏全局預測能力，且在高負載下易失效 [cite: 63]。
* [cite_start]**重現性危機**：現有研究多在封閉或不相容的模擬環境中開發 [cite: 19, 23, 96][cite_start]，導致模型跨平台復現時可能產生高達 **15%** 的效能誤差 [cite: 26, 27]。

---

## 解決方案：LibSignal 框架

[cite_start]LibSignal 提供了一個開放原始碼的評估標準，旨在消除實驗偏差並確保科學再現性 [cite: 35, 36]。

### [cite_start]1. 系統架構 [cite: 106, 107]
[cite_start]本系統採用分層解耦設計 [cite: 33, 34]：
* [cite_start]**環境層 (Environment Layer)**：支援 SUMO 與 CityFlow 等主流模擬器 [cite: 113]。
* [cite_start]**封裝接口 (Wrapper Interface)**：符合 OpenAI Gym 標準，規範化數據格式 [cite: 112]。
* [cite_start]**代理層 (Agent Layer)**：包含 DQN、FRAP、CoLight 等多種強化學習演算法 [cite: 32, 111]。
* [cite_start]**指標監測 (Metric Monitor)**：即時分析旅行時間、延遲與吞吐量 [cite: 108, 109]。

### 2. 強化學習三大要素 (The RL Trinity)
* [cite_start]**狀態空間 (Observation)**：觀測車道密度、當前相位以及紅燈後的排隊長度 [cite: 128, 130, 132, 133]。
* [cite_start]**動作空間 (Action Space)**：每 10 秒評估一次，從預定義相位集中選擇最優相位 [cite: 144, 145][cite_start]，並強制注入「黃燈切換間隔」以確保交通安全 [cite: 146, 147]。
* [cite_start]**獎勵函數 (Reward Function)** [cite: 149]：
  $$R = -\sum(\text{Queue Length} + \beta \times \text{Delay})$$
  [cite_start]透過最小化負值獎勵，引導模型減少排隊長度與等待時間 [cite: 151, 155]。

---

## 技術亮點

* [cite_start]**動態相位執行**：跳脫傳統的順序循環，模型能根據即時路口壓力直接跳轉至最關鍵的相位，同時遵守最小綠燈安全限制 [cite: 224, 235]。
* [cite_start]**多進程架構**：利用 LibSignal 的併發機制同時開啟多個模擬實例，大幅縮短訓練時間 [cite: 223, 233, 234]。
* [cite_start]**網路級協作 (CoLight)**：引入 **圖注意力網路 (GAT)** 進行路口間信息交換，提前識別上游流量高峰，實現全局優化 [cite: 84, 88, 91]。

---

## 實作環境與流程

### [cite_start]開發環境 [cite: 169]
* [cite_start]**OS**: Ubuntu 22.04 LTS / Windows 11 (WSL2) [cite: 171]
* [cite_start]**Language**: Python 3.8+ [cite: 171]
* [cite_start]**Core Stack**: PyTorch 1.12.1+ [cite: 171]
* [cite_start]**Simulator**: SUMO (Simulation of Urban Mobility) [cite: 171]

### [cite_start]訓練工作流 [cite: 157]
1. [cite_start]**數據預處理**：載入杭州或紐約等城市真實路網拓撲，轉化為 JSON 格式與流量向量 [cite: 158, 159, 174, 175]。
2. [cite_start]**離線訓練**：執行 200 個 Epoch，利用 **經驗回放 (Experience Replay)** 更新神經網路權重 [cite: 161, 162, 220]。
3. [cite_start]**在線評估**：針對未見過的交通分佈進行壓力測試，評估模型泛化能力 [cite: 165, 166]。

---

## 實驗結果

[cite_start]在杭州與紐約的真實數據集下，針對高密度流量（>1,000 輛車/小時）進行測試 [cite: 42]：
* [cite_start]**平均旅行時間**：下降 **20-25%** [cite: 43, 44]。
* [cite_start]**路口排隊長度**：縮短 **15-30%** [cite: 45, 46]。
* [cite_start]**尖峰吞吐量**：提升約 **12%** [cite: 47, 48]。

---

## 參考文獻
* [1] Mei, H., et al. (2023). LibSignal: An open library for traffic signal control. [cite_start]*Machine Learning*, 1-37. [cite: 38]
* [2] Wei, H., et al. (2019). CoLight: Learning network-level cooperation for traffic signal control. [cite_start]*CIKM*, 1913-1922. [cite: 92]
* [3] Zheng, G., et al. (2019). FRAP: Learning phase competition for traffic signal control. [cite_start]*KDD*, 196-205. [cite: 80]