const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function getEnumDescription(e: any): string {
  return Object.keys(e)
    .map((k) => e[k])
    .join('|');
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
