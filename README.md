# PXA RE Management

PXA RE Managementは、NestJS（バックエンド）とReact（フロントエンド）を使用したmonorepo構成のWebアプリケーションです。

## プロジェクト構成

```
pxa-re-management/
├── apps/
│   ├── backend/          # NestJS バックエンドAPI
│   └── frontend/         # React フロントエンド
├── packages/
│   └── shared/           # 共通型定義とDTO
├── docker-compose.yml    # Docker構成
└── pnpm-workspace.yaml   # pnpm workspace設定
```

## 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- pnpm 8以上
- Docker (開発環境用)

> ⚠️ Zscalerの利用のため、Gitとpnpmの追加設定が必要。
> 詳しくは[こちら](https://dev.azure.com/lscm-pxa-re/pxa-re/_wiki/wikis/pxa-re.wiki/7)。


### インストール

```bash
# 依存関係のインストール
pnpm install

# 共通パッケージのビルド
pnpm --filter @pxa-re-management/shared build
```

### 開発サーバーの起動

```bash
# すべてのアプリケーションを同時に起動
pnpm dev

# 個別にアプリケーションを起動
pnpm --filter backend dev
pnpm --filter frontend dev
```

## DTOと型の共通化

このプロジェクトでは、`packages/shared`にフロントエンドとバックエンドで共通して使用する型定義とDTOを配置しています。

### 共通パッケージの構成

```
packages/shared/
├── src/
│   ├── dtos/             # DTO型定義
│   ├── types/            # 型定義
│   ├── constants/        # 定数
│   └── index.ts          # エクスポート
├── package.json
└── tsconfig.json
```

### DTOの使用方法

#### バックエンド（NestJS）
共通の型を実装してバリデーションクラスを作成：

```typescript
// apps/backend/src/general-cost/dto/create-general-cost.dto.ts
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import type { CreateGeneralCostType as ICreateGeneralCostType } from '@pxa-re-management/shared';

export class CreateGeneralCostDto implements ICreateGeneralCostType {
  @IsString()
  @IsNotEmpty()
  generalCostCd: string;

  @IsBoolean()
  invFlg: boolean;

  // ... その他のプロパティ
}
```

#### フロントエンド（React）
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

  // ... コンポーネントの実装
};
```

### API レスポンスの型安全性

```typescript
// 共通のレスポンス型を使用
import type { SuccessResponse, GeneralCostWithNames } from '@pxa-re-management/shared';

// バックエンド
async findAll(): Promise<GeneralCostWithNames[]> {
  return this.generalCostService.findAll();
}

// フロントエンド
const fetchGeneralCosts = async (): Promise<GeneralCostWithNames[]> => {
  const response = await api.get<SuccessResponse<GeneralCostWithNames[]>>('/general-cost');
  return response.data.data;
};
```

### 共通パッケージの開発

```bash
# 共通パッケージのビルド
pnpm --filter @pxa-re-management/shared build

# 共通パッケージの開発（ファイル監視）
pnpm --filter @pxa-re-management/shared dev
```

### 利点

1. **型安全性**: フロントエンドとバックエンドで同じ型定義を使用
2. **一貫性**: APIの入出力が常に一致
3. **開発効率**: 型定義の重複を排除
4. **保守性**: 型の変更時に全体で自動的に反映
5. **Pure TypeScript**: interfaceではなくtypeを使用し、外部ライブラリに依存しない軽量な型定義

## アーキテクチャ

### バックエンド（Clean Architecture）
- **Controller**: リクエストの受信とレスポンスの返却
- **UseCase**: ビジネスロジックの実行
- **Repository**: データアクセスの抽象化
- **Infrastructure**: 外部依存の具体実装

### フロントエンド（Atomic Design）
- **Atoms**: 基本的なUI要素
- **Molecules**: 複数のatomsの組み合わせ
- **Organisms**: 複数のmoleculesの組み合わせ
- **Templates**: レイアウト構造
- **Pages**: 実際のページコンテンツ

## テスト

```bash
# 全アプリケーションのテスト実行
pnpm test

# 個別テスト実行
pnpm --filter backend test
pnpm --filter frontend test
pnpm --filter @pxa-re-management/shared test
```

## ビルド

```bash
# 全アプリケーションのビルド
pnpm build

# 個別ビルド
pnpm --filter backend build
pnpm --filter frontend build
pnpm --filter @pxa-re-management/shared build
```

## デプロイ

```bash
# Docker イメージの作成
docker build -t pxa-re-management-backend ./apps/backend
docker build -t pxa-re-management-frontend ./apps/frontend
```

# Appendix

pnpm でエラーが出る場合
以下文言のエラーが出る場合。
（例ではprismaでエラー）

```
> pnpm prisma format
> Downloading Prisma engines for Node-API for windows [                    ] 0%Error: request to https://binaries.prisma.sh/all_commits/f40f79ec31188888a2e33acda0ecc8fd10a853a9/windows/schema-engine.exe.gz.sha256 failed, reason: unable to get local issuer certificate  // 証明書でエラー

// 証明書チェックの無効化
> $env:NODE_TLS_REJECT_UNAUTHORIZED=0
> pnpm config set strict-ssl false
```