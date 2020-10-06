import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let usersRepository: FakeUsersRepository;
let userTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    userTokensRepository = new FakeUserTokensRepository();

    resetPasswordService = new ResetPasswordService(
      usersRepository,
      userTokensRepository,
    );
  });

  it('should be able to reset the password.', async () => {
    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    const { token } = await userTokensRepository.generate(user.id);

    await resetPasswordService.execute({
      token,
      password: 'stark',
    });

    const updatedUser = await usersRepository.findById(user.id);

    expect(updatedUser?.password).toBe('stark');
  });
});
