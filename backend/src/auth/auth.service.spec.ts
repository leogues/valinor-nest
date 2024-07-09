import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { User } from '../entities/user.entity';
import { UserDTO } from '../users/user';
import { AuthDTO } from './auth';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: Repository<Auth>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Auth, User],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([Auth, User]),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(async () => {
    await authRepository.query('DELETE FROM auth');
    await userRepository.query('DELETE FROM user');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let user: User;

    beforeEach(async () => {
      const userDTO: UserDTO = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        picture: 'picture',
      };
      user = await userRepository.save(userDTO);
    });

    it('should call save method of authRepository with correct parameters', async () => {
      const authDTO: AuthDTO = {
        sourceId: 'sourceId',
        source: 'source',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expires: new Date(),
        userId: user.id,
      };
      await service.create(authDTO);
      const savedAuth = await authRepository.findOneBy({
        source: authDTO.source,
        sourceId: authDTO.sourceId,
      });

      expect(savedAuth).toBeDefined();
      expect(savedAuth).toMatchObject(authDTO);
    });
  });

  describe('findOne', () => {
    let user: User;
    let auth: Auth;

    beforeEach(async () => {
      const userDTO: UserDTO = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        picture: 'picture',
      };
      user = await userRepository.save(userDTO);

      const authDTO: AuthDTO = {
        sourceId: 'sourceId',
        source: 'source',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expires: new Date(),
        userId: user.id,
      };
      auth = await authRepository.save(authDTO);
      auth.user = user;
    });

    it('should return auth with user relation', async () => {
      const foundAuth = await service.findOne(auth.source, auth.sourceId);
      expect(foundAuth).toBeDefined();
      expect(foundAuth).toEqual(auth);
    });
  });

  describe('update', () => {
    let user: User;
    let auth: Auth;

    beforeEach(async () => {
      const userDTO: UserDTO = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        picture: 'picture',
      };
      user = await userRepository.save(userDTO);

      const authDTO: AuthDTO = {
        sourceId: 'sourceId',
        source: 'source',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expires: new Date(),
        userId: user.id,
      };
      auth = await authRepository.save(authDTO);
    });

    it('should update auth with correct parameters', async () => {
      const partialAuth: Partial<AuthDTO> = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };
      await service.update(auth.id, partialAuth);
      const updatedAuth = await authRepository.findOneBy({ id: auth.id });

      expect(updatedAuth).toBeDefined();
      expect(updatedAuth.accessToken).toEqual(partialAuth.accessToken);
      expect(updatedAuth.refreshToken).toEqual(partialAuth.refreshToken);
    });
  });
});
