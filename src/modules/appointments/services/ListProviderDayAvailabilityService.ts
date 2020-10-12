import { getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  year: number;
  month: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { }

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findProviderAvailabilityByDay(
      {
        provider_id,
        year,
        month,
        day,
      },
    );

    const startHour = 8;
    const workHours = 10;

    const hoursArray = Array.from(
      {
        length: workHours,
      },
      (_, index) => index + startHour,
    );

    const availability = hoursArray.map((hour) => {
      const appointmentInHour = appointments.find((appointment) => {
        return getHours(appointment.date) === hour;
      });

      const currentDate = new Date(Date.now());
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !appointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
