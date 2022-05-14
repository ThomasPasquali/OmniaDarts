import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test} from '@nestjs/testing';
import { User, UserSchema } from '../../schemas/user.schema';
import { UsersController } from '../users/users.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';


describe('AuthController', () => {
  
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {

    function mockUserModel(dto: any) {
      this.data = dto;
      this.save  = () => {
        return this.data;
      };
    }

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, JwtModule.register({secret: 'secret'})],
      controllers: [AuthController],
      providers: [UsersService, AuthService, JwtStrategy, ConfigService,{
        provide: getModelToken(User.name),
        useValue: mockUserModel,
      }],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    controller = moduleRef.get<AuthController>(AuthController);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('defined', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  })

  describe('login', () => {
    it('should return an access token', async () => {

      const u = { nickname : 'test', _id : 'test', pwd : 'test' }


      const result = new Promise<any>(
        (resolve, reject) => {
          resolve(u);
        })
      jest.spyOn(authService, 'validateUser').mockImplementation((u,p) => result);

      expect(await controller.login(u)).toHaveProperty('access_token');

      const decoded = jwtService.verify((await controller.login(u)).access_token)
      expect(decoded.username).toBe('test')
      expect(decoded.sub).toBe('test')
    });
  });


});
