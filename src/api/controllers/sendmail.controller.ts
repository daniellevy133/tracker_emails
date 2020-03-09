
import CrudController from '../../generics/baseCrud.controller';
import {SendEmailsModel} from'../../db/models/sendemails.model';
import { Request, Response, NextFunction } from 'express';
import SendEmailHandler from'../handlers/sendemail.hendler'

class SendMailController extends CrudController{
    private sendmailHandler = new SendEmailHandler()
    
    protected initializeRoutes(): void {
        this.router.get('/',this.getAll.bind(this));
        this.router.get('/checkemailstatus',this.check.bind(this));
    }
    
    protected getSchema(): import("mongoose").Model<any, {}> {
        return SendEmailsModel;
    }

    private async check (request: Request, response: Response, next: NextFunction){
        try{
            response.status(200).send(await this.sendmailHandler.checkStatusMail(request.query._id));
        }catch(err){
            next(err);
        }
    }


}

export default SendMailController;