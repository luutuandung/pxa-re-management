## i18n 多言語対応ガイド

このフロントエンドは i18next + react-i18next による多言語対応を行っています。ページを新規作成する際の手順を以下にまとめます。

### 前提
- 翻訳リソースは `apps/frontend/src/i18n/locales/{ja|en}/*.json` に配置します。
- 名前空間ごとに 1 ファイルを用意します。例: ページ `MyNewPage` → 名前空間 `myNewPage`。
- i18n 初期化は `apps/frontend/src/i18n/index.ts` で行われ、必要な名前空間を動的 import します。
- 選択されている言語の状態は `store/languageSettings` を参照して取得・変更できます。

### 手順: 新規ページを多言語対応する
1) 名前空間を決める
- ページ単位で 1 名前空間を作成します。例: `myNewPage`。

2) 翻訳ファイルを作成する
- 以下 2 ファイルを追加します。
  - `apps/frontend/src/i18n/locales/ja/myNewPage.json`
  - `apps/frontend/src/i18n/locales/en/myNewPage.json`

例 (ja):
```json
{
  "title": "新規ページのタイトル",
  "description": "このページの説明文です",
  "button": {
    "save": "保存",
    "cancel": "キャンセル"
  }
}
```

例 (en):
```json
{
  "title": "New Page Title",
  "description": "This page description",
  "button": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

3) i18n に名前空間を登録する
- `apps/frontend/src/i18n/index.ts` の動的 import 部分に追記します。

```ts
// 動的 import に追記
const myNewPageModule = await import(`./locales/${language}/myNewPage.json`);
resources.myNewPage = myNewPageModule.default;
```

- 併せて `ns` 配列にも `myNewPage` を追加します。

```ts
ns: [
  'common',
  'home',
  'businessCostItemCodeRegistration',
  'uniformCostItemCodeRegistration',
  'businessCostItemSettings',
  'costAggregationScenario',
  'myNewPage', // ← 追加
],
```

4) ページで翻訳を使う
- ページコンポーネントで `useTranslation('myNewPage')` を使用します。

```tsx
import { useTranslation } from 'react-i18next';

export default function MyNewPage() {
  const { t } = useTranslation('myNewPage');

  return (
    <section>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button>{t('button.save')}</button>
    </section>
  );
}
```

- `tWithNamespace` ヘルパーを使う場合は以下のように書けます。

```tsx
import { tWithNamespace } from '@/i18n'; // インポートパスは環境に応じて調整

<h1>{tWithNamespace('myNewPage', 'title')}</h1>
```

### 現在の言語の取得・切り替え（store/languageSettings）
- 選択されている言語は `store/languageSettings` のフックから取得できます。

```tsx
import { useLanguageSelectors, useLanguageActions } from '@/store/languageSettings'; // インポートパスは相対で調整可

export function LanguageAwareComponent() {
  const { currentLanguage, isJapanese } = useLanguageSelectors();
  const { changeLanguage } = useLanguageActions();

  return (
    <div>
      <span>Current: {currentLanguage}</span>
      <button onClick={() => changeLanguage('ja')}>日本語</button>
      <button onClick={() => changeLanguage('en')}>English</button>
      {isJapanese ? <p>日本語です</p> : <p>英語です</p>}
    </div>
  );
}
```


```tsx
import { useLanguage } from '@/store/languageSettings'; // インポートパスは相対で調整可

const { currentLanguage, changeLanguage } = useLanguage();
```

### 補足
- 共通文言は `common` 名前空間に配置し、各ページはページ固有の文言のみを定義することを推奨します。
- 新しい名前空間が表示されない場合は、`index.ts` の動的 import と `ns` 配列の両方に追加できているかを確認してください。
- 文字列の差し込みは `t('greeting', { name: 'Taro' })` のように記述できます。


