import AppError from '@shared/errors/AppError';
import { getOverlappingDaysInIntervals } from 'date-fns';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  it('should be able to authenticate user.', async () => {
    const usersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(usersRepository, hashProvider);
    const authenticateUser = new AuthenticateUserService(
      usersRepository,
      hashProvider,
    );

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

  it('should not be able to authenticate with non-existing credentials.', async () => {
    const usersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      usersRepository,
      hashProvider,
    );

    expect(
      authenticateUser.execute({
        email: 'john@got.com',
        password: 'ghost',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user with wrong credentials.', async () => {
    const usersRepository = new FakeUsersRepository();
    const hashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(usersRepository, hashProvider);
    const authenticateUser = new AuthenticateUserService(
      usersRepository,
      hashProvider,
    );

    const userData = {
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    };

    await createUser.execute(userData);

    expect(
      authenticateUser.execute({
        email: userData.email,
        password: 'not-the-right-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
