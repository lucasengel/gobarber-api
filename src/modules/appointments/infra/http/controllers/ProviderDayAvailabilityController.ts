import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProviderDayAvailabilityController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { year, month, day } = request.body;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await listProviderDayAvailability.execute({
      provider_id,
      year,
      month,
      day,
    });

    return response.json(availability);
  }
}

export default ProviderDayAvailabilityController;
