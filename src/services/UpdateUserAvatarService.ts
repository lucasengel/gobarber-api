import { getRepository } from "typeorm";
import path from "path";
import fs from "fs";

import uploadConfig from "../config/upload";
import User from "../models/User";
import AppError from "../errors/AppError";

interface Request {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) throw Error("Only authenticated users can change their avatar.");

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        try {
          await fs.promises.unlink(userAvatarFilePath);
        } catch (error) {
          throw new AppError(error, 401);
        }
      }
    }

    user.avatar = avatarFileName;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
