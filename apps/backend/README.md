

# PXA RE Management Backend

NestJSベースのバックエンドAPIサーバーです。

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Error Handling

このプロジェクトでは、統一的なエラーハンドリングシステムを採用しています。すべてのエラーは自動的にグローバルエラーフィルターによってキャッチされ、一貫したレスポンス形式で返されます。

### エラーレスポンス形式

```json
{
  "statusCode": 404,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/general-cost/123",
  "method": "GET",
  "message": "GeneralCost with identifier 123 not found",
  "errorCode": "NOT_FOUND",
  "details": {
    "resource": "GeneralCost",
    "identifier": "123"
  }
}
```

### 使用可能なエラークラス

#### BaseException
- すべてのカスタムエラーの基底クラス
- 直接使用することは推奨されません

#### NotFoundException
- リソースが見つからない場合に使用
- HTTPステータス: 404

```typescript
// 使用例
throw new NotFoundException('GeneralCost', generalCostCd);
throw new NotFoundException('User'); // identifierなしでも可能
```

#### BusinessException
- ビジネスロジックに関するエラーに使用
- HTTPステータス: 400

```typescript
// 使用例
throw new BusinessException('General cost code already exists', 'DUPLICATE_CODE');
throw new BusinessException('Invalid operation', 'INVALID_OPERATION', { reason: 'Status is locked' });
```

#### ValidationException
- バリデーションエラーに使用
- HTTPステータス: 400

```typescript
// 使用例
throw new ValidationException('General cost code is required');
throw new ValidationException('Invalid format', { field: 'generalCostCd', value: 'ABC' });
```

#### UnauthorizedException
- 認証が必要な場合に使用（認証されていない状態）
- HTTPステータス: 401
- 使用場面: ログイン未完了、トークン無効、認証情報不正など

```typescript
// 使用例
throw new UnauthorizedException('Login required');
throw new UnauthorizedException('Invalid token');
throw new UnauthorizedException('Token expired');
throw new UnauthorizedException(); // デフォルトメッセージ使用
```

#### ForbiddenException
- 権限不足の場合に使用（認証済みだが権限がない状態）
- HTTPステータス: 403
- 使用場面: ロール不足、リソースへのアクセス権限なしなど

```typescript
// 使用例
throw new ForbiddenException('Admin access required');
throw new ForbiddenException('Insufficient permissions to access this resource');
throw new ForbiddenException('You cannot modify this data');
throw new ForbiddenException(); // デフォルトメッセージ使用
```

### エラーハンドリングのベストプラクティス

1. **適切なエラークラスの選択**
   - データが見つからない場合: `NotFoundException`
   - ビジネスルールに反する場合: `BusinessException`
   - 入力値の検証失敗: `ValidationException`
   - 認証が必要（未認証）: `UnauthorizedException`
   - 権限不足（認証済み）: `ForbiddenException`

2. **エラーメッセージの作成**
   - 具体的で理解しやすいメッセージを使用
   - 機密情報は含めない
   - 国際化を考慮する場合は、エラーコードを活用

3. **エラーコードの使用**
   - 同じ種類のエラーには一貫したエラーコードを使用
   - 大文字とアンダースコアを使用（例：`DUPLICATE_CODE`）

4. **詳細情報の提供**
   - デバッグに役立つ追加情報を`details`に含める
   - 機密情報は含めない

### 使用例

```typescript
// サービスクラス内での使用例
@Injectable()
export class ExampleService {
  async findById(id: string): Promise<Example> {
    // 入力値の検証
    if (!id) {
      throw new ValidationException('ID is required');
    }

    try {
      const example = await this.repository.findById(id);
      
      if (!example) {
        throw new NotFoundException('Example', id);
      }

      return example;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // 再スロー
      }
      throw new BusinessException('Failed to fetch example', 'FETCH_ERROR', error);
    }
  }

  async create(data: CreateExampleDto): Promise<Example> {
    // 重複チェック
    const existing = await this.repository.findByCode(data.code);
    if (existing) {
      throw new BusinessException(
        `Example with code ${data.code} already exists`,
        'DUPLICATE_CODE',
        { code: data.code }
      );
    }

    try {
      return await this.repository.create(data);
    } catch (error) {
      throw new BusinessException('Failed to create example', 'CREATE_ERROR', error);
    }
  }
}
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
