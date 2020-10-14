import { container } from 'tsyringe';

import { Request, Response } from 'express';
import SendForgotPasswordMailService from '@modules/users/services/SendForgotPasswordMailService';

class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordMailService = container.resolve(
      SendForgotPasswordMailService,
    );

    await sendForgotPasswordMailService.execute({
      email,
    });

    return response.status(204).json();
  }
}

export default ForgotPasswordController;
