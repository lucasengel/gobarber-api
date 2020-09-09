import { getRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import User from "../models/Users";

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

    if (!user) throw new Error("User/Password doesn't match");

    // password - non-hashed
    // user.password - hashed
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw new Error("User/Password doesn't match");

    const token = sign({}, "121A6678889EC2BDA06EE4AF6B29BA35", {
      subject: user.id,
      expiresIn: "1w",
    });

    return {
      user,
      token,
    };
  }
}

export default CreateAppointmentService;
