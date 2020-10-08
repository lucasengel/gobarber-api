import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const profileRouter = Router();
profileRouter.use(ensureAuthenticated);

const profileController = new ProfileController();

profileRouter.get('/', profileController.fetch);
profileRouter.put('/', profileController.update);

export default profileRouter;
