import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { User } from '../entities/user.entity';
import { UserDTO } from './user';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Auth],
          synchronize: true,
          dropSchema: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(async () => {
    await userRepository.query('DELETE FROM user');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call save method of userRepository with correct parameters', async () => {
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        picture: 'picture',
      };
      await service.create(user);
      const savedUser = await userRepository.findOneBy({ email: user.email });

      expect(savedUser).toBeDefined();
      expect(savedUser).toMatchObject(user);
    });
  });

  describe('find', () => {
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

    it('should return the user with the given id', async () => {
      const foundUser = await service.findByID(user.id);
      expect(foundUser).toBeDefined();
      expect(foundUser).toEqual(user);
    });

    it('should return the user with the given email', async () => {
      const foundUser = await service.findOne(user.email);
      expect(foundUser).toBeDefined();
      expect(foundUser).toEqual(user);
    });
  });

  describe('findOrCreate', () => {
    it('should create user if it does not exist', async () => {
      const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        picture: 'picture',
      };
      await service.create(user);
      const createUser = await service.findOrCreate(user);
      expect(createUser).toBeDefined();
      expect(createUser).toMatchObject(user);
    });

    it('should find existing user', async () => {
      const userDTO: UserDTO = {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        picture: 'picture',
      };
      const user = await userRepository.save(userDTO);
      const foundUser = await service.findOrCreate(userDTO);
      expect(foundUser).toBeDefined();
      expect(foundUser).toEqual(user);
    });
  });
});
