import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { User } from '../../schemas/user.schema';
import { Club } from '../../schemas/club.schema';
import { CaslModule } from '../casl/casl.module';
import { UsersModule } from '../users/users.module';
import { ClubsController } from './clubs.controller';
import { ClubsModule } from './clubs.module';
import { ClubsService } from './clubs.service';
import { UsersService } from '../users/users.service';

describe('ClubsController', () => {

  function mockClubModel(dto: any) {
    this.data = dto;
    this.save  = () => {
      return this.data;
  }};

  let controller: ClubsController;
  let service: ClubsService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CaslModule, UsersModule],
      controllers: [ClubsController],
      providers: [
        ClubsService, { provide: getModelToken(Club.name), useValue: mockClubModel },
        { provide: getModelToken(User.name), useValue: mockClubModel }],
    }).compile();

    controller = module.get<ClubsController>(ClubsController);
    service = module.get<ClubsService>(ClubsService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('createANewClub', () => {
    it('should create a new club and make the user admin', async () => {

      const user = { nickname : 'test', _id : 'test', pwd: 'test'}
      const newClub = { name : 'test', description : 'test', admin: []}
      const newClubWithAdmin = newClub && { admin: [user] }
      const userWithClub = user && { club: [newClubWithAdmin] }

      const returnClubCreated = async (club) => newClub as Club;
      const returnClubCreatedWithAdmin = async (club) => newClubWithAdmin as Club;
      const returnUserCreated = async (id) => user as User;
      const returnUserWithAdmin = async (id, us) => us;
      const req = {user: user};
      
      
      jest.spyOn(service, 'addClub').mockImplementation(returnClubCreated);
      jest.spyOn(userService, 'findById').mockImplementation(returnUserCreated);
      jest.spyOn(userService, 'update').mockImplementation(returnUserWithAdmin);
      jest.spyOn(service, 'update').mockImplementation(returnClubCreated);

      const response = await controller.addClub(newClub as Club, req);

      expect(response).toHaveProperty('admin');
      expect(response.admin[0]._id).toBe('test');
      expect(response.admin[0].club.name).toBe('test');

    });
  });

});
