import AppError from '@shared/errors/AppError';
import { addDays, setHours } from 'date-fns';
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
      date: addDays(new Date(setHours(Date.now(), 9)), 3),
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  it('should NOT be able to create appointments at the same time.', async () => {
    appointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(appointmentsRepository);

    const appointmentDate = addDays(new Date(setHours(Date.now(), 9)), 3);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider-id',
      user_id: 'user-id',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create an appointment in the past', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 10, 12).getTime());

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create an appointment with own user', async () => {
    await expect(
      createAppointment.execute({
        date: addDays(new Date(), 3),
        provider_id: 'same-id',
        user_id: 'same-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create an appointment outside work hours', async () => {
    await expect(
      createAppointment.execute({
        date: addDays(new Date(setHours(Date.now(), 7)), 3),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: addDays(new Date(setHours(Date.now(), 23)), 3),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
