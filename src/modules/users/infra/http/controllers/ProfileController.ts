import { container } from 'tsyringe';
import { Request, Response } from 'express';
import UpdateUserProfileService from '@modules/users/services/UpdateUserProfileService';
import FetchUserProfileService from '@modules/users/services/FetchUserProfileService';
import { classToClass } from 'class-transformer';

class ProfileController {
  public async fetch(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const fetchUserProfile = container.resolve(FetchUserProfileService);

    const user = await fetchUserProfile.execute({ user_id });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, password, old_password } = request.body;

    const updateProfile = container.resolve(UpdateUserProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return response.json(classToClass(user));
  }
}

export default ProfileController;
