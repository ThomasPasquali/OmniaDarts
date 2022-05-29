import { HttpException, HttpStatus } from '@nestjs/common';

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function getEnumDescription(e: any): string {
  return Object.keys(e)
    .map((k) => e[k])
    .join('|');
}

export function checkNull(obj: any, message: string) {
  if (obj == null) throwHttpExc(message, HttpStatus.BAD_REQUEST);
}

export function checkNotNull(obj: any, message: string) {
  if (obj != null) throwHttpExc(message, HttpStatus.CONFLICT);
}

export class SocketIOBodyUnwrapper<T> {
  constructor(private body: any) {} //TODO define events data structure

  public get(): T {
    return this.body.data.notification; //TODO generalize
  }
}

export function generateString(length) {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function throwHttpExc(message: string, code) {
  throw new HttpException(
    {
      status: code,
      error: message,
    },
    code,
  );
}
