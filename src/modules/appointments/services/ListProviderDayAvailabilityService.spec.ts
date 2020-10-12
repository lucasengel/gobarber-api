import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let appointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProvidersDayAvailability', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      appointmentsRepository,
    );
  });

  it('should be able to list providers daily availability.', async () => {
    await appointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 13, 0, 0),
    });

    await appointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 16, 0, 0),
    });

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 4, 20, 12).getTime());

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'provider_id',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 11, available: false },
        { hour: 13, available: false },
        { hour: 14, available: true },
        { hour: 15, available: true },
        { hour: 16, available: false },
      ]),
    );
  });
});
