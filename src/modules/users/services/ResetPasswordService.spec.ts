import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let usersRepository: FakeUsersRepository;
let userTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;
let hashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    userTokensRepository = new FakeUserTokensRepository();
    hashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      usersRepository,
      userTokensRepository,
      hashProvider,
    );
  });

  it('should be able to reset the password.', async () => {
    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    const generateHash = jest.spyOn(hashProvider, 'generateHash');

    const { token } = await userTokensRepository.generate(user.id);

    await resetPassword.execute({
      token,
      password: 'stark',
    });

    const updatedUser = await usersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('stark');
    expect(updatedUser?.password).toBe('stark');
  });

  it('should NOT be able to reset the password if token has expired (currently: 2h)', async () => {
    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    const { token } = await userTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const now = new Date();

      const addedHours = now.setHours(now.getHours() + 3);

      return addedHours;
    });

    await expect(
      resetPassword.execute({
        token,
        password: 'stark',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: 'stark',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to reset the password with non-existing token', async () => {
    const { token } = await userTokensRepository.generate(
      'non-existing-user-id',
    );

    await expect(
      resetPassword.execute({
        token,
        password: 'stark',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

// 2h window
