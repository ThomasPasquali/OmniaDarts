import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken} from '@nestjs/mongoose';
import { Test} from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { User } from '../../schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';


describe('AuthController', () => {
  
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UsersService;

  beforeEach(async () => {

    function mockUserModel(dto: any) {
      this.data = dto;
      this.save  = () => {
        return this.data;
      };
    }

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, AuthModule, UsersModule],
      controllers: [AuthController],
      providers: [UsersService, AuthService, ConfigService,{
        provide: getModelToken(User.name),
        useValue: mockUserModel,
      }],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    controller = moduleRef.get<AuthController>(AuthController);
    jwtService = moduleRef.get<JwtService>(JwtService);
    userService = moduleRef.get<UsersService>(UsersService);
  });

  describe('defined', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  })

  describe('login', () => {
    it('should return an access token if user\'s logged', async () => {

      // Case "all it's gonna be alright"
      const u = { nickname : 'test', 
                  _id : 'test', 
                  pwd : 'test',
                  googleToken: '',
                  imageUrl: '',
                  matches: [],
                  friends: []}
      const result = new Promise<any>(
      (resolve, reject) => {
        resolve(u);
      })
      jest.spyOn(authService, 'validateUser').mockImplementation((u) => result);

      expect(await controller.login(u as User)).toHaveProperty('access_token');
      const decoded = jwtService.verify((await controller.login(u as User)).access_token);
      console.log(decoded)
      expect(decoded.username).toBe('test');
      expect(decoded.sub).toBe('test');

      // Case "all it's wrong in this world" (unregistered user)
      jest.spyOn(authService, 'validateUser').mockImplementation((u,p) => null);
      
      await expect(controller.login(u as User)).rejects.toThrow(new UnauthorizedException());

    });
  });

  describe('register', () => {
    it('should return an access token if a user is successfully created', async () => {

      // Case "all it's gonna be alright"
      const u = { nickname : 'test',
                  _id : 'test', 
                  pwd : 'test',
                  imageUrl : '',
                  googleToken : '',
                  matches : [],
                  friends : []};
      const result = new Promise<any>(
      (resolve, reject) => {
        resolve(u);
      })
      jest.spyOn(userService, 'create').mockImplementation((u) => result);

      expect(await controller.register(u as User)).toHaveProperty('access_token');
      const decoded = jwtService
        .verify((await controller.register(u as User))
        .access_token);
      expect(decoded.username).toBe('test');
      expect(decoded.sub).toBe('test');

      // Case "all it's wrong in this world" (registering procedure fails)
      jest.spyOn(userService, 'create')
          .mockImplementation((u) => null); // save operation fails
      
      await expect(controller.register(u as User))
          .rejects.toThrow(new InternalServerErrorException());

    });
  });

});
