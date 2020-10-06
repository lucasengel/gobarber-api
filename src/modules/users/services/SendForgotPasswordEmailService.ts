import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokesRepository';

interface IRequest {
  id: string;
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

  public async execute({ id, email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    const token = await this.userTokensRepository.generate(id);

    if (!user) throw new AppError('Email could not be found.');

    this.emailProvider.sendEmail(
      email,
      `Password reset required with token ${token}`,
    );
  }
}

export default SendForgotPasswordEmailService;
