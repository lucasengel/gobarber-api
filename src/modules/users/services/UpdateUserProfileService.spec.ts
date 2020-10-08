import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserProfileService from './UpdateUserProfileService';

let usersRepository: FakeUsersRepository;
let updateUserProfile: UpdateUserProfileService;
let hashProvider: FakeHashProvider;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();

    updateUserProfile = new UpdateUserProfileService(
      usersRepository,
      hashProvider,
    );
  });

  it('should be able to update user name.', async () => {
    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      name: 'Aegon Targaryen',
    });

    expect(updatedUser.name).toBe('Aegon Targaryen');
  });

  it('should be able to update user email.', async () => {
    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      email: 'aegon@got.com',
    });

    expect(updatedUser.email).toBe('aegon@got.com');
  });

  it("should NOT be able to update user email to one that's taken.", async () => {
    await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    const user = await usersRepository.create({
      name: 'Arya Stark',
      email: 'arya@got.com',
      password: 'nymeria',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        email: 'john@got.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user email to own current email.', async () => {
    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      email: 'john@got.com',
    });

    expect(updatedUser.email).toBe('john@got.com');
  });

  it('should NOT update user profile of non-existing user.', async () => {
    await expect(
      updateUserProfile.execute({
        user_id: 'non-existing-user',
        name: 'Aegon Targaryen',
        email: 'aegon@got.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password, providing old password.', async () => {
    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: user.id,
      password: 'ygritte',
      old_password: 'ghost',
    });

    expect(updatedUser.password).toBe('ygritte');
  });

  it('should NOT be able to update user password, without old password.', async () => {
    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        password: 'ygritte',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should NOT be able to update user password, if old password doesn't match.", async () => {
    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        old_password: 'ygritte',
        password: 'ygritte',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
