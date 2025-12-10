import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      // log: ['query', 'error', 'info', 'warn'],
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // ミドルウェアでクエリ実行時間を監視
    this.$use(async (params, next) => {
      const start = Date.now();
      const result = await next(params);
      const end = Date.now();
      const duration = end - start;

      const slowQueryThreshold = 100; // 100ms

      if (duration > slowQueryThreshold) {
        this.logger.warn(`SLOW QUERY DETECTED`, {
          model: params.model,
          action: params.action,
          duration: `${duration}ms`,
          args: JSON.stringify(params.args, null, 2),
          timestamp: new Date().toISOString(),
        });
      }

      // 非常に遅いクエリの場合は詳細なスタックトレースも出力
      if (duration > 1000) {
        this.logger.error(`VERY SLOW QUERY (${duration}ms)`, {
          model: params.model,
          action: params.action,
          duration: `${duration}ms`,
          args: params.args,
          stack: new Error().stack,
        });
      }

      return result;
    });
  }
}
