import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let usersRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    createUser = new CreateUserService(usersRepository, hashProvider);
  });

  it('should be able to create a user.', async () => {
    const user = await createUser.execute({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    expect(user).toHaveProperty('id');
  });

  it('should NOT be able to create a user when email already exists.', async () => {
    await createUser.execute({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    await expect(
      createUser.execute({
        name: 'John Snow',
        email: 'john@got.com',
        password: 'ghost',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
