import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

class ProvidersController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const listProviders = container.resolve(ListProvidersService);

    const providers = await listProviders.execute({ user_id: id });

    return response.json(classToClass(providers));
  }
}

export default ProvidersController;
