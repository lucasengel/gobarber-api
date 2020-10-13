import { getHours, isBefore, isWithinInterval, startOfHour } from 'date-fns';
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
    // check if appt is in the past
    if (isBefore(appointmentDate, Date.now()))
      throw new AppError("Appointment can't be in the past.");

    // check if appt was booked with own user
    if (user_id === provider_id)
      throw new AppError("Appointment can't be booked with own user");

    // check if appt is within work hours
    if (getHours(date) < 8 || getHours(date) > 17)
      throw new AppError('Appointment is outside work hours');

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
