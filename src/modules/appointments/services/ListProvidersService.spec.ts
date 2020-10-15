import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let usersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let cacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    cacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(usersRepository, cacheProvider);
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
