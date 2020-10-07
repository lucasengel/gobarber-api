import FakeDiskStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should update user avatar.', async () => {
    const usersRepository = new FakeUsersRepository();
    const storageProvider = new FakeDiskStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      usersRepository,
      storageProvider,
    );

    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'fakeFilename.png',
    });

    expect(user.avatar).toBe('fakeFilename.png');
  });

  it('should delete avatar when uploading new one.', async () => {
    const usersRepository = new FakeUsersRepository();
    const storageProvider = new FakeDiskStorageProvider();

    const deleteFile = jest.spyOn(storageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      usersRepository,
      storageProvider,
    );

    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'fakeFilename.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'fakeFilenameV2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('fakeFilename.png');
    expect(user.avatar).toBe('fakeFilenameV2.png');
  });

  it('should NOT update user avatar of non existing user.', async () => {
    const usersRepository = new FakeUsersRepository();
    const storageProvider = new FakeDiskStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      usersRepository,
      storageProvider,
    );

    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFileName: 'fakeFilename.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
