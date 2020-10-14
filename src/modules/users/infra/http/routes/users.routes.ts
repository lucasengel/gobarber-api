import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated';

import { celebrate, Joi, Segments } from 'celebrate';
import UsersController from '../controllers/UsersController';
import UsersAvatarController from '../controllers/UsersAvatarController';

const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();
const upload = multer(uploadConfig);
const usersRouter = Router();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update,
);

export default usersRouter;
