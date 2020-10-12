import { v4 as uuid } from 'uuid';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import { getDate, getMonth, getYear, isEqual } from 'date-fns';
import IFindProviderAvailabilityByMonthDTO from '@modules/appointments/dtos/IFindProviderAvailabilityByMonthDTO';
import IFindProviderAvailabilityByDayDTO from '@modules/appointments/dtos/IFindProviderAvailabilityByDayDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = this.appointments.find((app) =>
      isEqual(app.date, date),
    );

    return appointment;
  }

  public async findProviderAvailabilityByMonth({
    provider_id,
    month,
    year,
  }: IFindProviderAvailabilityByMonthDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) === month - 1
      );
    });

    return appointments;
  }

  public async findProviderAvailabilityByDay({
    provider_id,
    year,
    month,
    day,
  }: IFindProviderAvailabilityByDayDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getYear(appointment.date) === year &&
        getMonth(appointment.date) === month - 1 &&
        getDate(appointment.date) === day
      );
    });

    return appointments;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentsRepository;
