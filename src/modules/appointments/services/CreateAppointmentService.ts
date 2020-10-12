import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  date: Date;
  provider_id: string;
  user_id: string;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findConflictingAppointment = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findConflictingAppointment) {
      throw new AppError('Time slot already taken');
    }

    const appointment = this.appointmentsRepository.create({
      date: appointmentDate,
      provider_id,
      user_id,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
