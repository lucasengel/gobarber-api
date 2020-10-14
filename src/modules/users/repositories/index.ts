import { container } from 'tsyringe';
import IUsersRepository from './IUsersRepository';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import IUserTokensRepository from './IUserTokensRepository';
import UserTokensRepository from '../infra/typeorm/repositories/UserTokensRepository';

const repositories = {
  users: UsersRepository,
  userTokens: UserTokensRepository,
};

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  repositories.users,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  repositories.userTokens,
);
