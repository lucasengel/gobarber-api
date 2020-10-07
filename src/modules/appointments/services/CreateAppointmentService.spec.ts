import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  test('It should be able to create a new appointment.', async () => {
    const appointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: 'asbdkdaflvakdsjhfblds',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('asbdkdaflvakdsjhfblds');
  });

  test('It should not be able to create appointments at the same time.', async () => {
    const appointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
    );

    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'asbdkdaflvakdsjhfblds',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'asbdkdaflvakdsjhfblds',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
