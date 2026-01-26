# Giải thích yêu cầu - Ngắn gọn

## Màn hình thực hiện

**Màn hình**: `CalcRegisterPage` (計算式登録画面 - Màn hình đăng ký công thức tính toán)

**Đường dẫn**: `apps/frontend/src/pages/CalcRegister/CalcRegisterPage.tsx`

**API Endpoint**: `POST /calc-display`

**Hàm gọi**: `saveCalculation()` trong store `calcRegister.ts`

**Luồng**:
1. User chọn Business Unit và Calc Type
2. User chọn một BU_COST_CODE và click để chỉnh sửa công thức
3. User chỉnh sửa công thức trong dialog editor
4. User click "Save" → Gọi `saveCalculation()`
5. `saveCalculation()` gọi API `POST /calc-display` với payload
6. Backend `updateCalcDatas()` xử lý và lưu cho tất cả BU_COST_ITEM cùng BU_COST_CODE

## Vấn đề

**Một BU_COST_CODE có nhiều BU_COST_ITEM với currency khác nhau (JPY, USD, EUR...)**

Ví dụ:
- BU_COST_CODE: "A001" 
  - BU_COST_ITEM_1: currency = JPY
  - BU_COST_ITEM_2: currency = USD
  - BU_COST_ITEM_3: currency = EUR

**Yêu cầu**: Công thức tính toán **KHÔNG thay đổi theo currency**. 
→ Khi lưu công thức cho BU_COST_ITEM_1 (JPY), phải tự động lưu cho BU_COST_ITEM_2 (USD) và BU_COST_ITEM_3 (EUR) luôn.

## Các bảng liên quan

### 1. **BU_COST_CODE** 
- Mã chi phí (ví dụ: "A001")
- 1 BU_COST_CODE → nhiều BU_COST_ITEM

### 2. **BU_COST_ITEM**
- Chi phí cụ thể theo currency
- Có `buCostCodeId` → thuộc về 1 BU_COST_CODE
- Có `curCd` → currency (JPY, USD...)

### 3. **CALC_DISPLAY**
- Cấu hình tính toán cho 1 BU_COST_ITEM
- 1 BU_COST_ITEM → 1 CALC_DISPLAY (với điều kiện cùng calcTypeId)

### 4. **CALC_FORMULA**
- Công thức tính toán (dạng cây, có thể lồng nhau)
- 1 CALC_DISPLAY → nhiều CALC_FORMULA
- **Mỗi CALC_DISPLAY có CALC_FORMULA riêng** (ID khác nhau)

### 5. **CALC_CONDITION** (Điều kiện IF)
- Ví dụ: "A > B"
- **ĐƯỢC CHIA SẺ** giữa tất cả CALC_FORMULA của các BU_COST_ITEM cùng BU_COST_CODE

### 6. **CALC_OPERATION** (Phép toán)
- Ví dụ: +, -, *, /
- **ĐƯỢC CHIA SẺ** giữa tất cả CALC_FORMULA của các BU_COST_ITEM cùng BU_COST_CODE

## Luồng xử lý (3 bước)

### Bước 1: Tìm tất cả BU_COST_ITEM cùng BU_COST_CODE (đã tồn tại)
```
BU_COST_ITEM hiện tại (JPY) 
  ↓
Lấy buCostCodeId
  ↓
Tìm TẤT CẢ BU_COST_ITEM đã tồn tại có cùng buCostCodeId
→ [BU_COST_ITEM_JPY, BU_COST_ITEM_USD] (nếu chỉ có 2 currency đã được tạo)

⚠️ LƯU Ý: Code KHÔNG tự động tạo BU_COST_ITEM mới
→ Chỉ tìm và lưu công thức cho các BU_COST_ITEM đã có sẵn
```

### Bước 2: Xóa và tạo mới Conditions/Operations (1 lần)
```
- Thu thập tất cả conditionIds và operationIds cũ
- Xóa tất cả (1 lần)
- Tạo mới (1 lần)
→ Tất cả BU_COST_ITEM sẽ dùng chung các ID này
```

### Bước 3: Lưu công thức cho TỪNG BU_COST_ITEM
```
Với mỗi BU_COST_ITEM:
  1. Tạo/cập nhật CALC_DISPLAY
  2. Xóa CALC_FORMULA cũ
  3. Tạo CALC_FORMULA mới:
     - calcFormulaId: ID MỚI (vì unique)
     - calcConditionId: CÙNG ID (chia sẻ)
     - calcOperationId: CÙNG ID (chia sẻ)
     - nestCalcFormulaId: Map lại ID mới (giữ cấu trúc cây)
```

## Kết quả

Sau khi lưu, **TẤT CẢ BU_COST_ITEM đã tồn tại** cùng BU_COST_CODE sẽ có:

✅ **Cùng Conditions** (calcConditionId giống nhau)  
✅ **Cùng Operations** (calcOperationId giống nhau)  
✅ **Cùng cấu trúc công thức** (logic giống nhau, chỉ khác calcFormulaId)

**Ví dụ:**
- Nếu trước đó chỉ có 1 BU_COST_ITEM (JPY):
  - BU_COST_ITEM_JPY → CALC_DISPLAY_1 → CALC_FORMULA_1, CALC_FORMULA_2

- Nếu sau này tạo thêm BU_COST_ITEM_USD và BU_COST_ITEM_EUR, rồi lưu công thức lại:
  - BU_COST_ITEM_JPY → CALC_DISPLAY_1 → CALC_FORMULA_1, CALC_FORMULA_2
  - BU_COST_ITEM_USD → CALC_DISPLAY_2 → CALC_FORMULA_3, CALC_FORMULA_4
  - BU_COST_ITEM_EUR → CALC_DISPLAY_3 → CALC_FORMULA_5, CALC_FORMULA_6

→ Tất cả đều dùng chung:
- calcConditionId: "COND-001"
- calcOperationId: "OP-001"

→ Công thức giống nhau, chỉ khác ID của CALC_FORMULA.

## ⚠️ Lưu ý quan trọng

**Code KHÔNG tự động tạo BU_COST_ITEM mới cho các currency khác.**

- BU_COST_ITEM phải được tạo trước đó (từ UI khác hoặc import)
- Code chỉ tìm các BU_COST_ITEM đã tồn tại và lưu công thức cho chúng
- Nếu chỉ có 1 BU_COST_ITEM (JPY) → chỉ lưu cho 1 item đó
- Nếu có 3 BU_COST_ITEM (JPY, USD, EUR) → lưu cho cả 3 item
