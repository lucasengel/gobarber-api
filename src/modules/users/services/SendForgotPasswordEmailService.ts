import path from 'path';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('EmailProvider')
    private emailProvider: IEmailProvider,
  ) { }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Email could not be found.');

    const token = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.emailProvider.sendEmail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Password reset requested',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          token: token.token,
          link: `http://localhost:3000/reset-password?token=${token.token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
