import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";

import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";
import AppError from "../errors/AppError";

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findConflictingAppointment = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findConflictingAppointment) {
      throw new AppError("Time slot already taken");
    }

    /**
     * create() will only create the instance of the repository,
     * not store in the database
     */
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    /**
     * save() will then store the instance
     */
    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
