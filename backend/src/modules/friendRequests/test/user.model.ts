import { User } from 'src/schemas/user.schema';

export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  findOne(): { exec: () => T } {
    return {
      exec: (): T => this.entityStub,
    };
  }

  async find(): Promise<T[]> {
    return [this.entityStub];
  }

  async save(): Promise<T> {
    return this.entityStub;
  }

  async findOneAndUpdate(): Promise<T> {
    return this.entityStub;
  }
}

export const userStub = (): User => {
  return {
    nickname: 'test',
    pwd: 'test',
  } as User;
};

export class UserModel extends MockModel<User> {
  protected entityStub = userStub();
}
