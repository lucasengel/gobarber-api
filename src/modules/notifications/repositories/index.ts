import { container } from 'tsyringe';
import INotificationsRepository from './INotificationsRepository';
import NotificationsRepository from '../infra/typeorm/repositories/NotificationsRepository';

const repositories = {
  notifications: NotificationsRepository,
};

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  repositories.notifications,
);
