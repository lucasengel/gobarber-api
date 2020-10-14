import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindProviderAvailabilityByDayDTO from '@modules/appointments/dtos/IFindProviderAvailabilityByDayDTO';
import IFindProviderAvailabilityByMonthDTO from '@modules/appointments/dtos/IFindProviderAvailabilityByMonthDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getRepository, Raw, Repository } from 'typeorm';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findProviderAvailabilityByMonth({
    provider_id,
    year,
    month,
  }: IFindProviderAvailabilityByMonthDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'YYYY-MM') = '${year}-${parsedMonth}'`,
        ),
      },
    });

    return appointments;
  }

  public async findProviderAvailabilityByDay({
    provider_id,
    year,
    month,
    day,
  }: IFindProviderAvailabilityByDayDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    const appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async create({
    date,
    provider_id,
    user_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      date,
      provider_id,
      user_id,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
