import * as NestJS from "@nestjs/common";
import { type Prisma, PrismaClient } from '@prisma/client';


@NestJS.Injectable()
export class PrismaService extends PrismaClient implements NestJS.OnModuleInit, NestJS.OnModuleDestroy {

  private static readonly SLOW_QUERY_THRESHOLD__MILLISECONDS: number = 100;
  private static readonly VERY_SLOW_QUERY_THRESHOLD__MILLISECONDS: number = 1000;

  private readonly logger: NestJS.Logger = new NestJS.Logger(PrismaService.name);

  public constructor() {
    super({ log: ["error", "warn"] });
  }

  public async onModuleInit(): Promise<void> {

    await this.$connect();

    this.$use(
      async (
        middlewareParams: Prisma.MiddlewareParams,
        next: (middlewareParams: Prisma.MiddlewareParams) => Promise<unknown>
      ): Promise<unknown> => {

      const timeMomentDirectoryBeforeRequest__millisecondsSiceEpoch = Date.now();
      const queryResult: unknown = await next(middlewareParams);
      const timeMomentDirectoryAfterRequest__millisecondsSiceEpoch = Date.now();
      const duration__milliseconds: number =
          timeMomentDirectoryAfterRequest__millisecondsSiceEpoch - timeMomentDirectoryBeforeRequest__millisecondsSiceEpoch;

      if (duration__milliseconds > PrismaService.SLOW_QUERY_THRESHOLD__MILLISECONDS) {
        this.logger.warn(
          "SLOW QUERY DETECTED",
          {
            model: middlewareParams.model,
            action: middlewareParams.action,
            duration: `${ duration__milliseconds } ms`,
            args: JSON.stringify(middlewareParams.args, null, 2),
            timestamp: new Date().toISOString()
          }
        );
      }

      if (duration__milliseconds > PrismaService.VERY_SLOW_QUERY_THRESHOLD__MILLISECONDS) {
        this.logger.error(
          "VERY SLOW QUERY DETECTED",
          {
            model: middlewareParams.model,
            action: middlewareParams.action,
            duration: `${ duration__milliseconds } ms`,
            args: middlewareParams.args,
            stack: new Error().stack
          }
        );
      }

      return queryResult;

    });

  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

}
