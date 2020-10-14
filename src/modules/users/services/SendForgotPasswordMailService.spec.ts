import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordMailService from './SendForgotPasswordMailService';

let usersRepository: FakeUsersRepository;
let userTokensRepository: FakeUserTokensRepository;
let mailProvider: FakeMailProvider;
let sendForgotPasswordMail: SendForgotPasswordMailService;

describe('SendForgotPasswordMail', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    userTokensRepository = new FakeUserTokensRepository();
    mailProvider = new FakeMailProvider();
    sendForgotPasswordMail = new SendForgotPasswordMailService(
      usersRepository,
      userTokensRepository,
      mailProvider,
    );
  });

  it('should be able to reset the password providing an email.', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    await sendForgotPasswordMail.execute({
      email: user.email,
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it("should NOT be able to reset the password when email doesn't exist.", async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await expect(
      sendForgotPasswordMail.execute({
        email: 'john@got.com',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(sendMail).not.toHaveBeenCalled();
  });

  it('should generate a forgot user token.', async () => {
    const generateToken = jest.spyOn(userTokensRepository, 'generate');

    const user = await usersRepository.create({
      name: 'John Snow',
      email: 'john@got.com',
      password: 'ghost',
    });

    await sendForgotPasswordMail.execute({
      email: user.email,
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
