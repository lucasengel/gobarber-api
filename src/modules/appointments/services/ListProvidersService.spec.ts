import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let usersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(usersRepository);
  });

  it('should be able to list providers, excluding authenticated user.', async () => {
    const user1 = await usersRepository.create({
      name: 'Arya Stark',
      email: 'arya@got.com',
      password: 'ghost',
    });

    const user2 = await usersRepository.create({
      name: 'Sansa Stark',
      email: 'john@got.com',
      password: 'ghost',
    });

    const authenticatedUser = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    const providers = await listProviders.execute({
      user_id: authenticatedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
