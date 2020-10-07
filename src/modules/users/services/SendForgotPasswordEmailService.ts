import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokesRepository';

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

    await this.emailProvider.sendEmail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Password reset requested',
      templateData: {
        template:
          'Hi, {{name}}.\nUse the following link (within 2 hours) to reset your password: http://locahost:3333/password/reset?token={{token}}',
        variables: {
          name: user.name,
          token: token.token,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
