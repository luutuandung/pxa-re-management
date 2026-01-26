# So sánh Code Trước và Sau Khi Sửa

## 1. Thay đổi: Bỏ điều kiện length > 1

### TRƯỚC:
```typescript
// Dòng 109-113 trong getBusinessUnitCostCodesSelection()
const targetBusinessCostItem =
  businessUnitCode.buCostItems.length > 1 ?
      businessUnitCode.buCostItems.find((item) => item.curCd === currencyCode) 
      : businessUnitCode.buCostItems[0];

if (!targetBusinessCostItem) {
  throw new BusinessException("原価コードの標本の中に原価項目が一個以上存在するか、通貨が合っているものが存在と期待されたが、どちらでもの条件が満たされていない。")
}
```

### SAU:
```typescript
// Dòng 111
const targetBusinessCostItem = businessUnitCode.buCostItems[0];

if (!targetBusinessCostItem) {
  throw new BusinessException("原価コードの標本の中に原価項目が一個以上存在するか、通貨が合っているものが存在と期待されたが、どちらでもの条件が満たされていない。")
}
```

**Giải thích:** Bỏ điều kiện kiểm tra currency, luôn lấy item đầu tiên vì công thức không thay đổi theo currency.

---

## 2. Thay đổi chính: Lưu công thức cho tất cả BU_COST_ITEM cùng BU_COST_CODE

### TRƯỚC:
```typescript
// Chỉ lưu cho 1 BU_COST_ITEM (item được chọn)
public async updateCalcDatas(updateCalcDatasDto: UpdateCalcDatasDto, userId: string | null = null): Promise<void> {
  // ... validation ...
  
  // Lấy calcDisplayId từ request
  let calcDisplayId: string = updateCalcDatasDto.calcDisplayId;
  const existingCalcDisplay = await this.prisma.calcDisplay.findUnique({ where: { calcDisplayId } });
  
  // ... tạo/cập nhật calcDisplay cho 1 item ...
  
  // Xóa và tạo lại Conditions/Operations
  await prismaClient.calcCondition.deleteMany({...});
  await prismaClient.calcOperation.deleteMany({...});
  await prismaClient.calcCondition.createMany({...});
  await prismaClient.calcOperation.createMany({...});
  
  // Xóa và tạo lại CalcFormula cho 1 item
  await prismaClient.calcFormula.deleteMany({ where: { calcDisplayId } });
  await prismaClient.calcFormula.createMany({
    data: orderedFormulas.map((f) => ({
      calcFormulaId: f.calcFormulaId,  // Dùng ID cũ
      calcDisplayId: calcDisplayId,
      // ...
    }))
  });
}
```

### SAU:
```typescript
public async updateCalcDatas(updateCalcDatasDto: UpdateCalcDatasDto, userId: string | null = null): Promise<void> {
  // ... validation ...
  
  // BƯỚC 1: Lấy buCostCodeId từ BU_COST_ITEM hiện tại
  const targetBuCostItem = await this.prisma.buCostItem.findUniqueOrThrow({
    where: { buCostItemId: targetBuCostItemId },
    select: { buCostCodeId: true, businessunitId: true },
  });

  // BƯỚC 2: Tìm TẤT CẢ BU_COST_ITEM cùng BU_COST_CODE
  const allBuCostItemsWithSameCode = await this.prisma.buCostItem.findMany({
    where: {
      buCostCodeId: targetBuCostItem.buCostCodeId,
      businessunitId: targetBuCostItem.businessunitId,
      calcValidFlg: true,
    },
    select: { buCostItemId: true },
  });
  // → Kết quả: [BU_COST_ITEM_JPY, BU_COST_ITEM_USD, BU_COST_ITEM_EUR]

  // BƯỚC 3: Thu thập tất cả Conditions/Operations cũ từ TẤT CẢ items
  const allExistingConditionIds = new Set<string>();
  const allExistingOperationIds = new Set<string>();

  for (const buCostItem of allBuCostItemsWithSameCode) {
    const itemCalcDisplay = await prismaClient.calcDisplay.findFirst({
      where: { calcTypeId: targetCalcTypeId, buCostItemId: buCostItem.buCostItemId }
    });
    if (itemCalcDisplay) {
      const existingFormulas = await prismaClient.calcFormula.findMany({
        where: { calcDisplayId: itemCalcDisplay.calcDisplayId },
      });
      // Thu thập IDs
      existingFormulas.forEach((f: any) => {
        if (f.calcConditionId) allExistingConditionIds.add(f.calcConditionId);
        if (f.calcOperationId) allExistingOperationIds.add(f.calcOperationId);
        if (f.elseCalcOperationId) allExistingOperationIds.add(f.elseCalcOperationId);
      });
    }
  }

  // BƯỚC 4: Xóa và tạo mới Conditions/Operations (1 lần, được chia sẻ)
  if (allExistingConditionIds.size > 0) {
    await prismaClient.calcCondition.deleteMany({ 
      where: { calcConditionId: { in: Array.from(allExistingConditionIds) } } 
    });
  }
  if (allExistingOperationIds.size > 0) {
    await prismaClient.calcOperation.deleteMany({ 
      where: { calcOperationId: { in: Array.from(allExistingOperationIds) } } 
    });
  }
  
  // Tạo mới (1 lần)
  await prismaClient.calcCondition.createMany({...});
  await prismaClient.calcOperation.createMany({...});

  // BƯỚC 5: Lưu công thức cho TỪNG BU_COST_ITEM
  for (const buCostItem of allBuCostItemsWithSameCode) {
    // 5.1. Tạo/cập nhật CalcDisplay cho mỗi item
    let itemCalcDisplay = await prismaClient.calcDisplay.findFirst({
      where: { calcTypeId: targetCalcTypeId, buCostItemId: buCostItem.buCostItemId }
    });
    
    if (!itemCalcDisplay) {
      itemCalcDisplay = await prismaClient.calcDisplay.create({...});
    } else {
      await prismaClient.calcDisplay.update({...});
    }

    // 5.2. Xóa CalcFormula cũ
    await prismaClient.calcFormula.deleteMany({ 
      where: { calcDisplayId: itemCalcDisplay.calcDisplayId } 
    });

    // 5.3. Tạo CalcFormula mới với ID mới
    const formulaIdMap = new Map<string, string>();
    for (const f of orderedFormulas) {
      formulaIdMap.set(f.calcFormulaId, randomUUID()); // Tạo ID mới
    }

    await prismaClient.calcFormula.createMany({
      data: orderedFormulas.map((f) => {
        const newFormulaId = formulaIdMap.get(f.calcFormulaId)!;
        const newNestCalcFormulaId = f.nestCalcFormulaId && f.nestCalcFormulaId !== '' 
          ? (formulaIdMap.get(f.nestCalcFormulaId) || null)
          : null;
        const newElseNestCalcFormulaId = f.elseNestCalcFormulaId && f.elseNestCalcFormulaId !== '' 
          ? (formulaIdMap.get(f.elseNestCalcFormulaId) || null)
          : null;

        return {
          calcFormulaId: newFormulaId,  // ID MỚI (unique cho mỗi calcDisplay)
          calcDisplayId: itemCalcDisplay.calcDisplayId,
          calcConditionId: f.calcConditionId,  // CÙNG ID (chia sẻ)
          calcOperationId: f.calcOperationId,  // CÙNG ID (chia sẻ)
          elseCalcOperationId: f.elseCalcOperationId,  // CÙNG ID (chia sẻ)
          nestCalcFormulaId: newNestCalcFormulaId,  // Map lại ID mới
          elseNestCalcFormulaId: newElseNestCalcFormulaId,  // Map lại ID mới
          evalSeq: 0
        };
      }),
    });
  }
}
```

---

## So sánh luồng xử lý

### TRƯỚC:
```
Request: Lưu công thức cho BU_COST_ITEM_JPY
  ↓
1. Tìm/Create CalcDisplay cho JPY
2. Xóa Conditions/Operations cũ
3. Tạo Conditions/Operations mới
4. Xóa CalcFormula cũ của JPY
5. Tạo CalcFormula mới cho JPY
  ↓
Kết quả: Chỉ JPY có công thức mới
```

### SAU:
```
Request: Lưu công thức cho BU_COST_ITEM_JPY
  ↓
1. Lấy buCostCodeId từ JPY
2. Tìm TẤT CẢ items cùng code: [JPY, USD, EUR]
3. Thu thập Conditions/Operations cũ từ TẤT CẢ items
4. Xóa Conditions/Operations cũ (1 lần)
5. Tạo Conditions/Operations mới (1 lần, chia sẻ)
6. Với mỗi item [JPY, USD, EUR]:
   - Tạo/Cập nhật CalcDisplay
   - Xóa CalcFormula cũ
   - Tạo CalcFormula mới (ID mới, nhưng dùng chung Conditions/Operations)
  ↓
Kết quả: Cả 3 items (JPY, USD, EUR) đều có công thức mới giống nhau
```

---

## Ví dụ cụ thể

### Scenario:
- **BU_COST_CODE:** "A001"
- **BU_COST_ITEM_JPY:** `buCostItemId = "item-jpy"`, `curCd = "JPY"`
- **BU_COST_ITEM_USD:** `buCostItemId = "item-usd"`, `curCd = "USD"`
- **BU_COST_ITEM_EUR:** `buCostItemId = "item-eur"`, `curCd = "EUR"`

### TRƯỚC - Lưu công thức cho JPY:
```typescript
// Chỉ tạo cho JPY
CalcDisplay_JPY {
  calcDisplayId: "display-jpy",
  buCostItemId: "item-jpy",
  calcFormulas: [
    { calcFormulaId: "formula-1", calcConditionId: "cond-1", calcOperationId: "op-1" }
  ]
}

// USD và EUR không được cập nhật
CalcDisplay_USD {
  calcDisplayId: "display-usd",
  buCostItemId: "item-usd",
  calcFormulas: [...] // Công thức cũ, không thay đổi
}
```

### SAU - Lưu công thức cho JPY:
```typescript
// Tạo cho JPY
CalcDisplay_JPY {
  calcDisplayId: "display-jpy",
  buCostItemId: "item-jpy",
  calcFormulas: [
    { calcFormulaId: "formula-jpy-1", calcConditionId: "cond-1", calcOperationId: "op-1" }
  ]
}

// Tự động tạo cho USD
CalcDisplay_USD {
  calcDisplayId: "display-usd",
  buCostItemId: "item-usd",
  calcFormulas: [
    { calcFormulaId: "formula-usd-1", calcConditionId: "cond-1", calcOperationId: "op-1" }
    // ↑ ID khác nhưng dùng chung cond-1 và op-1
  ]
}

// Tự động tạo cho EUR
CalcDisplay_EUR {
  calcDisplayId: "display-eur",
  buCostItemId: "item-eur",
  calcFormulas: [
    { calcFormulaId: "formula-eur-1", calcConditionId: "cond-1", calcOperationId: "op-1" }
    // ↑ ID khác nhưng dùng chung cond-1 và op-1
  ]
}

// Conditions và Operations được chia sẻ (chỉ tạo 1 lần)
CalcCondition { calcConditionId: "cond-1", ... }
CalcOperation { calcOperationId: "op-1", ... }
```

---

## Điểm khác biệt chính

| | TRƯỚC | SAU |
|---|---|---|
| **Số lượng items được lưu** | 1 item | Tất cả items cùng code |
| **Conditions/Operations** | Tạo cho 1 item | Tạo 1 lần, chia sẻ cho tất cả |
| **CalcFormula ID** | Dùng ID từ request | Tạo ID mới cho mỗi calcDisplay |
| **Nested Formula IDs** | Dùng ID từ request | Map lại ID mới để giữ cấu trúc cây |
| **Kết quả** | Chỉ 1 currency có công thức mới | Tất cả currency có công thức mới giống nhau |
