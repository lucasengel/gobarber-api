import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findConflictingAppointment = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findConflictingAppointment) {
      throw new AppError('Time slot already taken');
    }

    const appointment = this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
