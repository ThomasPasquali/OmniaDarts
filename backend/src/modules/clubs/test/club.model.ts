import { Club } from 'src/schemas/club.schema';

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

export const ClubStub = (): Club => {
  return {
    name: 'test',
    description: 'test',
  } as Club;
};

export class ClubModel extends MockModel<Club> {
  protected entityStub = ClubStub();
}
