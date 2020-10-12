import Appointment from '../infra/typeorm/entities/Appointment';

import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindProviderAvailabilityByMonthDTO from '../dtos/IFindProviderAvailabilityByMonthDTO';
import IFindProviderAvailabilityByDayDTO from '../dtos/IFindProviderAvailabilityByDayDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findProviderAvailabilityByMonth(
    data: IFindProviderAvailabilityByMonthDTO,
  ): Promise<Appointment[]>;
  findProviderAvailabilityByDay(
    data: IFindProviderAvailabilityByDayDTO,
  ): Promise<Appointment[]>;
}
