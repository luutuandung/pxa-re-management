# Dữ liệu mẫu để test màn hình Tính loại (計算種類)

## Cách test:
1. Mở màn hình "計算種類" (Calculation Types)
2. Chọn một Business Unit (拠点)
3. Click nút "追加" (Add) để thêm mới
4. Nhập dữ liệu theo mẫu bên dưới

## Dữ liệu mẫu:

### Mẫu 1: Tính toán chi phí sản xuất
- **Tên tiếng Nhật (計算種類)**: 生産コスト計算
- **Tên tiếng Anh (Name English)**: Production Cost Calculation
- **Tên tiếng Trung (Name Chinese)**: 生产成本计算
- **Default Flag**: ✓ (checked)

### Mẫu 2: Tính toán chi phí lao động
- **Tên tiếng Nhật**: 労働コスト計算
- **Tên tiếng Anh**: Labor Cost Calculation
- **Tên tiếng Trung**: 劳动力成本计算
- **Default Flag**: ☐ (unchecked)

### Mẫu 3: Tính toán chi phí nguyên vật liệu
- **Tên tiếng Nhật**: 材料費計算
- **Tên tiếng Anh**: Material Cost Calculation
- **Tên tiếng Trung**: 材料成本计算
- **Default Flag**: ☐ (unchecked)

### Mẫu 4: Tính toán chi phí vận hành
- **Tên tiếng Nhật**: 運営コスト計算
- **Tên tiếng Anh**: Operating Cost Calculation
- **Tên tiếng Trung**: 运营成本计算
- **Default Flag**: ☐ (unchecked)

### Mẫu 5: Tính toán chi phí quản lý
- **Tên tiếng Nhật**: 管理費計算
- **Tên tiếng Anh**: Management Cost Calculation
- **Tên tiếng Trung**: 管理成本计算
- **Default Flag**: ☐ (unchecked)

## Test các trường hợp:

### ✅ Test case 1: Thêm mới với đầy đủ 3 ngôn ngữ
- Nhập đầy đủ tên tiếng Nhật, Anh, Trung
- Click "保存" (Save)
- Kiểm tra dữ liệu đã được lưu đúng

### ✅ Test case 2: Thêm mới chỉ có tên tiếng Nhật
- Chỉ nhập tên tiếng Nhật, để trống Anh và Trung
- Click "保存" (Save)
- Kiểm tra có lưu được không (backend có thể yêu cầu không để trống)

### ✅ Test case 3: Sửa tên tiếng Anh và Trung của bản ghi cũ
- Chọn một bản ghi đã có
- Sửa tên tiếng Anh và Trung
- Click "保存" (Save)
- Kiểm tra dữ liệu đã được cập nhật

### ✅ Test case 4: Xóa bản ghi mới chưa lưu
- Thêm mới một bản ghi
- Click nút "🗑️" (xóa) ở cột "更新日時"
- Kiểm tra bản ghi đã bị xóa khỏi danh sách

## Lưu ý:
- Backend yêu cầu cả 3 trường không được để trống (IsNotEmpty)
- Nếu để trống, có thể sẽ báo lỗi validation
- Nên test với dữ liệu thực tế phù hợp với business logic

