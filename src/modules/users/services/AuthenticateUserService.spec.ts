import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  test('It should be able to authenticate user', async () => {
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
});
