import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Club } from './schemas/club.schema';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next.handle().pipe(map((data) => this.handleResponse(data)));
  }

  private handleResponse(data) {
    console.log(data);
    if (this.isClub(data)) {
      console.log('It is a club');
      const club: Club = data as Club;
      delete club.posts;
      return club;
    }
    return data;
  }

  private isClub(club: any): club is Club {
    return (<Club>club).name !== undefined;
  }
}
