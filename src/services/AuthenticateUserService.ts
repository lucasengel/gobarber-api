import { getRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import authConfig from "../config/auth";
import AppError from "../errors/AppError";
import User from "../models/User";

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateAppointmentService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) throw new AppError("User/Password doesn't match", 401);

    // password - non-hashed
    // user.password - hashed
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw new AppError("User/Password doesn't match", 401);

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default CreateAppointmentService;
