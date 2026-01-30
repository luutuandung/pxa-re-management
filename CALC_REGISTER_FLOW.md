# Luồng màn hình CalcRegister (計算式登録画面のフロー)

## Tiếng Việt

### Luồng chính

1. **Chọn điều kiện và tìm kiếm**
   - Chọn Business Unit → Load Calc Type
   - Chọn Calc Type → Click "Tìm kiếm"
   - Gọi API `GET /calc-display` để lấy danh sách calculations (công thức tính toán cho các BU_COST_ITEM)
   - Hiển thị bảng danh sách với 3 cột: Mã chi phí, Tên chi phí, Công thức tính toán

2. **Click vào item trong table → Gọi lại API lấy BU items**
   - Double-click vào một dòng trong bảng
   - Hàm `openEditor()` được gọi
   - **Quan trọng**: Từ `buCostItemId` của item được chọn, hệ thống:
     - Lấy currency (curCd) từ currencyMap
     - **Gọi lại API `GET /calc-display/cost-items`** với `businessunitId` và `curCode` để lấy BU items theo currency của item đó
   - Mở dialog editor với 2 phần: cây điều kiện (trái) và form chỉnh sửa (phải)

3. **Chỉnh sửa và lưu**
   - Chỉnh sửa điều kiện IF/ELSE và phép toán
   - Click "Lưu" → Chuyển tree → flat → Gọi API `POST /calc-display`
   - Sau khi lưu thành công, reload lại danh sách

### Đã thực hiện ở task No.95
- **Khi click vào item trong table, hệ thống sẽ gọi lại API để lấy BU items theo currency của item đó** (dòng 508 trong `calcRegister.ts`)
- Mục đích: Đảm bảo editor hiển thị đúng danh sách BU items theo currency của item đang chỉnh sửa

---

## 日本語

### 主なフロー

1. **条件選択と検索**
   - 事業部を選択 → 計算種類を読み込み
   - 計算種類を選択 → 「検索」をクリック
   - API `GET /calc-display` を呼び出して計算式リスト（BU_COST_ITEMごとの計算式）を取得
   - 3つの列（原価項目コード、原価項目名、計算式）を持つテーブルに一覧を表示

2. **テーブルの項目をクリック → BU項目を再取得するAPIを呼び出す**
   - テーブルの行をダブルクリック
   - `openEditor()` 関数が呼び出される
   - **重要**: 選択された項目の `buCostItemId` から、システムは：
     - currencyMapから通貨（curCd）を取得
     - **API `GET /calc-display/cost-items` を再呼び出し**して、その項目の通貨に基づいてBU項目を取得（`businessunitId` と `curCode` を指定）
   - 条件分岐ツリー（左）と編集フォーム（右）の2つの部分を持つダイアログエディタを開く

3. **編集と保存**
   - IF/ELSE条件と演算を編集
   - 「保存」をクリック → ツリーをフラットに変換 → API `POST /calc-display` を呼び出し
   - 保存成功後、リストを再読み込み

### タスクNo.95で実装済み
- **テーブルの項目をクリックすると、その項目の通貨に基づいてBU項目を取得するAPIが再呼び出されます**（`calcRegister.ts` の508行目）
- 目的: エディタが編集中の項目の通貨に基づいた正しいBU項目リストを表示することを保証するため
