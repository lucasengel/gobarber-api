import { format, getHours, isBefore, startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
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

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) { }

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now()))
      throw new AppError("Appointment can't be in the past.");

    if (user_id === provider_id)
      throw new AppError("Appointment can't be booked with own user");

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17)
      throw new AppError('Appointment is outside work hours');

    const findConflictingAppointment = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findConflictingAppointment) {
      throw new AppError('Time slot already taken');
    }

    const appointment = await this.appointmentsRepository.create({
      date: appointmentDate,
      provider_id,
      user_id,
    });

    const formattedDate = format(appointmentDate, "iii, LLL do 'at' h:mma"); // Mon, Jan. 2nd at 12PM

    await this.notificationsRepository.create({
      content: `New appointment scheduled for ${formattedDate}`,
      recipient_id: provider_id,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
