import AppError from '@shared/errors/AppError';
import FakeEmailProvider from '@shared/container/providers/EmailProvider/fakes/FakeEmailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let usersRepository: FakeUsersRepository;
let userTokensRepository: FakeUserTokensRepository;
let emailProvider: FakeEmailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    userTokensRepository = new FakeUserTokensRepository();
    emailProvider = new FakeEmailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      usersRepository,
      userTokensRepository,
      emailProvider,
    );
  });

  it('should be able to reset the password providing an email.', async () => {
    const sendEmail = jest.spyOn(emailProvider, 'sendEmail');

    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    await sendForgotPasswordEmail.execute({
      id: user.id,
      email: user.email,
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it("should NOT be able to reset the password when email doesn't exist.", async () => {
    const sendEmail = jest.spyOn(emailProvider, 'sendEmail');

    await expect(
      sendForgotPasswordEmail.execute({
        id: '1312312',
        email: 'john@got.com',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('should generate a forgot user token.', async () => {
    const generateToken = jest.spyOn(userTokensRepository, 'generate');

    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    await sendForgotPasswordEmail.execute({
      id: user.id,
      email: user.email,
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
