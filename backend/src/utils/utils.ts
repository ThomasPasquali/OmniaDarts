import { BadRequestException, ConflictException } from '@nestjs/common';

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function getEnumDescription(e: any): string {
  return Object.keys(e)
    .map((k) => e[k])
    .join('|');
}

export function checkNull(obj: any, message: string) {
  if (obj == null) throw new BadRequestException(message);
}

export function checkNotNull(obj: any, message: string) {
  if (obj != null) throw new ConflictException(message);
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

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
