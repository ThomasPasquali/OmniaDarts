
export function getEnumDescription(e: any): string {
  return Object.keys(e)
    .map((k) => e[k])
    .join('|');
}

export class SocketIOBodyUnwrapper<T> {

  constructor(private body: any) { } //TODO define events data structure

  public get(): T {
    return this.body.data.notification //TODO generalize
  }
}
