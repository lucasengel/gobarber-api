import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  test('It should be able to create a user.', async () => {
    const usersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(usersRepository);

    const user = await createUser.execute({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    expect(user).toHaveProperty('id');
  });

  test('It should NOT be able to create a user when email already exists.', async () => {
    const usersRepository = new FakeUsersRepository();
    const createUser = new CreateUserService(usersRepository);

    await createUser.execute({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    expect(
      createUser.execute({
        name: 'John Snow',
        email: 'john@got.com',
        password: 'ghost',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
