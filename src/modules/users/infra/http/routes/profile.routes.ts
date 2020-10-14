import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const profileRouter = Router();
profileRouter.use(ensureAuthenticated);

const profileController = new ProfileController();

profileRouter.get('/', profileController.fetch);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

export default profileRouter;
