import { Router} from 'express';
import TestController from './controllers/test.controller';
import SendMailController from './controllers/sendmail.controller';
import TrackerController from './controllers/tracker.controller';

//import V1Routes from './v1/v1.routes';



class ApiRoutes {
    public router = Router();

    constructor() {
      this.initializeRoutes();
    }

    private initializeRoutes() {
      const test = new TestController();
      const SendMail = new SendMailController();
      const tracker = new TrackerController()
      this.router.use('/test/',test.router);
      this.router.use('/sendmail/',SendMail.router);
      this.router.use('/',tracker.router);
    }

    
}

export default ApiRoutes;
