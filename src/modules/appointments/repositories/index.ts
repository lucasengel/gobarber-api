import { container } from 'tsyringe';
import IAppointmentsRepository from './IAppointmentsRepository';
import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository';

const repositories = {
  appointments: AppointmentsRepository,
};

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  repositories.appointments,
);
