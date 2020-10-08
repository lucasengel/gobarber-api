import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FetchUserProfileService from './FetchUserProfileService';

let usersRepository: FakeUsersRepository;
let fetchUserProfile: FetchUserProfileService;

describe('FetchUserProfile', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();

    fetchUserProfile = new FetchUserProfileService(usersRepository);
  });

  it('should be able to fetch user data.', async () => {
    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    const fetchedUser = await fetchUserProfile.execute({
      user_id: user.id,
    });

    expect(fetchedUser.name).toBe(user.name);
    expect(fetchedUser.email).toBe(user.email);
  });

  it('should NOT be able to fetch non-existing user data.', async () => {
    await expect(
      fetchUserProfile.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
