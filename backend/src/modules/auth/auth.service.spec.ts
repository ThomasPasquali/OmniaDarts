import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { User } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

describe('AuthService', () => {

  function mockUserModel(dto: any) {
    this.data = dto;
    this.save  = () => {
      return this.data;
    };
  }

  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();
  
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
