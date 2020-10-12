import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let appointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    appointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(appointmentsRepository);
  });

  it('should be able to create a new appointment.', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: 'non-existing-provider-id',
      user_id: 'non-existing-user-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('non-existing-provider-id');
  });

  it('should NOT be able to create appointments at the same time.', async () => {
    appointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(appointmentsRepository);

    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'non-existing-provider-id',
      user_id: 'non-existing-user-id',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'non-existing-provider-id',
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
