import { YYYY_MM_DD_HH_MM_SS } from '@/common/utils';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as moment from 'moment';
import { map, Observable } from 'rxjs';
import { MyResponse } from '../common/myResponse';

@Injectable()
export class TransferInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((d) => {
        if (d instanceof MyResponse && d.data) {
          bodyDateFormat(d.data);
        }
        return d;
      }),
    );
  }
}
function bodyDateFormat(data: any) {
  if (data instanceof Object) {
    const keys = Object.keys(data);
    for (const key of keys) {
      const v = data[key];
      if (v instanceof Date) {
        data[key] = moment(v).format(YYYY_MM_DD_HH_MM_SS);
      } else if (v instanceof Object) {
        bodyDateFormat(v);
      }
    }
  }
}
