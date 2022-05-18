export default class Notification {
  constructor(
    public id: number,
    public message: string,
    public state: string | null = null
  ) { }
}