import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";

import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findConflictingAppointment = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findConflictingAppointment) {
      throw Error("Time slot already taken");
    }

    /**
     * create() will only create the instance of the repository,
     * not store in the database
     */
    const appointment = appointmentsRepository.create({
      provider,
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
