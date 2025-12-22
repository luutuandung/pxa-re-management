import * as NestJS from "@nestjs/common";
import type { HttpArgumentsHost } from "@nestjs/common/interfaces";
import * as Express from "express";
import * as RXJS from "rxjs";


@NestJS.Injectable()
export default class JSON_BodyMaximalSizeInterceptor implements NestJS.NestInterceptor {

  public static setup({ bodyLimit__bytes }: Readonly<{ bodyLimit__bytes: number; }>): JSON_BodyMaximalSizeInterceptor {
    return new JSON_BodyMaximalSizeInterceptor(bodyLimit__bytes);
  }

  private constructor(private readonly bodyLimit__bytes: number) {}

  public intercept(context: NestJS.ExecutionContext, callingHandler: NestJS.CallHandler): RXJS.Observable<unknown> {

    const HTTP_Context: HttpArgumentsHost = context.switchToHttp();
    const request: Express.Request = HTTP_Context.getRequest<Express.Request>();

    if (request.socket.bytesRead > this.bodyLimit__bytes) {
      throw new NestJS.PayloadTooLargeException();
    }


    return callingHandler.handle();

  }

}
