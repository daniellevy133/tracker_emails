import { Router} from 'express';
import UserController from './controllers/user.controller';
import SendMailController from './controllers/sendmail.controller';
import TrackerController from './controllers/tracker.controller';

class ApiRoutes {
    public router = Router();

    constructor() {
      this.initializeRoutes();
    }

    private initializeRoutes() {
      const user = new UserController();
      const SendMail = new SendMailController();
      const tracker = new TrackerController()
      this.router.use('/user/',user.router);
      this.router.use('/sendmail/',SendMail.router);
      this.router.use('/',tracker.router);
    }

}

export default ApiRoutes;
