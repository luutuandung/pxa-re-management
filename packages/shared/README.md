# @pxa-re-management/shared

フロントエンドとバックエンドで共通して使用する型定義を提供するパッケージです。

## 目的

- フロントエンドとバックエンドの型安全性を確保
- APIの入出力の一貫性を保つ
- 型定義の重複を排除し、保守性を向上
- 開発効率の向上

## 構成

```
packages/shared/
├── src/
│   ├── types/            # 型定義
│   │   ├── general-cost.types.ts
│   │   ├── general-cost.request.ts
│   │   └── api-response.types.ts
│   ├── constants/        # 定数
│   │   ├── error-codes.ts
│   │   └── http-status.ts
│   └── index.ts          # エクスポート
├── dist/                 # ビルド出力
├── package.json
├── tsconfig.json
└── README.md
```

## 設計方針

- **type使用**: すべてinterfaceではなくtypeを使用
- **Type命名**: xxxDtoではなくxxxTypeを使用
- **Pure TypeScript**: バリデーションライブラリに依存しない型定義のみ
- **実用性重視**: 実際に使用される型定義のみを含める

## 使用方法

### 1. 共通パッケージのビルド

```bash
# 共通パッケージのビルド
pnpm --filter @pxa-re-management/shared build

# 開発時のファイル監視
pnpm --filter @pxa-re-management/shared dev
```

### 2. バックエンドでの使用

共通の型を実装してバリデーションクラスを作成：

```typescript
// apps/backend/src/general-cost/dto/create-general-cost.dto.ts
import { IsString, IsNotEmpty, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { CreateGeneralCostType, CreateGeneralCostNameType } from '@pxa-re-management/shared';

export class CreateGeneralCostNameDto implements CreateGeneralCostNameType {
  @IsString()
  @IsNotEmpty()
  languageCd: string;

  @IsString()
  @IsNotEmpty()
  generalCostName: string;
}

export class CreateGeneralCostDto implements CreateGeneralCostType {
  @IsString()
  @IsNotEmpty()
  generalCostCd: string;

  @IsBoolean()
  invFlg: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGeneralCostNameDto)
  generalCostNames: CreateGeneralCostNameDto[];
}
```

### 3. フロントエンドでの使用

共通の型を直接使用：

```typescript
// apps/frontend/src/components/GeneralCostForm.tsx
import type { CreateGeneralCostType } from '@pxa-re-management/shared';

const GeneralCostForm = () => {
  const [formData, setFormData] = useState<CreateGeneralCostType>({
    generalCostCd: '',
    invFlg: false,
    generalCostNames: []
  });

  // コンポーネントの実装...
};
```

### 4. サービスでの使用

共通のエンティティ型を使用：

```typescript
// apps/backend/src/general-cost/general-cost.service.ts
import type { GeneralCostWithNames } from '@pxa-re-management/shared';

@Injectable()
export class GeneralCostService {
  async findAll(): Promise<GeneralCostWithNames[]> {
    return this.prisma.generalCostCode.findMany({
      include: {
        generalCostNames: {
          include: {
            languageMaster: true,
          },
        },
      },
    });
  }
}
```

## 型定義の分類

### 1. Request Types

API リクエストで使用される型定義：

```typescript
// 作成用Type
export type CreateGeneralCostType = {
  generalCostCd: string;
  invFlg: boolean;
  generalCostNames: CreateGeneralCostNameType[];
};

// 更新用Type
export type UpdateGeneralCostType = {
  invFlg?: boolean;
  generalCostNames?: CreateGeneralCostNameType[];
};
```

### 2. Entity Types

データベースエンティティの型定義：

```typescript
// 基本エンティティ
export type GeneralCostCode = {
  generalCostCd: string;
  invFlg: boolean;
};

// 関連データを含む型
export type GeneralCostWithNames = GeneralCostCode & {
  generalCostNames: (GeneralCostName & {
    languageMaster: LanguageMaster;
  })[];
};
```

### 3. API Response Types

基本的なAPIレスポンスの型定義：

```typescript
// 基本レスポンス
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: ApiErrorResponse;
  timestamp: string;
};

// エラーレスポンス
export type ApiErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  errorCode?: string;
  details?: any;
};
```

### 4. Constants

定数の定義：

```typescript
// エラーコード
export const ERROR_CODES = {
  GENERAL_COST: {
    DUPLICATE_CODE: 'GENERAL_COST_DUPLICATE_CODE',
    INVALID_CODE: 'GENERAL_COST_INVALID_CODE',
    // ...
  }
} as const;
```

## 開発ルール

### 1. 命名規約

- **Request Types**: `{Action}{Entity}Type` (例: `CreateGeneralCostType`)
- **Entity Types**: `{Entity}` または `{Entity}With{Related}` (例: `GeneralCostWithNames`)
- **Constants**: `UPPER_SNAKE_CASE`

### 2. 型定義の方針

- **type使用**: interfaceではなくtypeを使用
- **交差型**: extendsの代わりに`&`を使用
- **Pure TypeScript**: バリデーションライブラリに依存しない
- **実用性重視**: 使用されない型定義は含めない

### 3. エクスポート

すべての型定義は`src/index.ts`でエクスポートすること：

```typescript
// Types
export * from './types/general-cost.types';
export * from './types/general-cost.request';
export * from './types/api-response.types';

// Constants
export * from './constants/error-codes';
export * from './constants/http-status';
```

## 利点

1. **型安全性**: フロントエンドとバックエンドで同じ型定義を使用
2. **一貫性**: APIの入出力が常に一致
3. **開発効率**: 型定義の重複を排除
4. **保守性**: 型の変更時に全体で自動的に反映
5. **軽量**: 実際に使用される型定義のみを含む
6. **Pure TypeScript**: interfaceではなくtypeを使用し、外部ライブラリに依存しない

## 注意事項

- 共通パッケージの変更時は、必ずビルドを実行してください
- 新しい型定義を追加する場合は、実際に使用される場合のみ追加してください
- 型定義の breaking change は、すべてのアプリケーションに影響するため慎重に行ってください 