import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let usersRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();

    createUser = new CreateUserService(usersRepository, hashProvider);
    authenticateUser = new AuthenticateUserService(
      usersRepository,
      hashProvider,
    );
  });

  it('should be able to authenticate user.', async () => {
    const userData = {
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    };

    const user = await createUser.execute(userData);

    const response = await authenticateUser.execute({
      email: userData.email,
      password: userData.password,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should NOT be able to authenticate with non-existing credentials.', async () => {
    await expect(
      authenticateUser.execute({
        email: 'john@got.com',
        password: 'ghost',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to authenticate user with wrong credentials.', async () => {
    const userData = {
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    };

    await createUser.execute(userData);

    await expect(
      authenticateUser.execute({
        email: userData.email,
        password: 'not-the-right-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
