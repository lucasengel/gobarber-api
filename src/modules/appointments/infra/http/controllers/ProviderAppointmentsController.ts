import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointments';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { year, month, day } = request.body;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointments.execute({
      provider_id,
      year,
      month,
      day,
    });

    return response.json(appointments);
  }
}

export default ProviderAppointmentsController;
