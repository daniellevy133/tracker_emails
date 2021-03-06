import * as Puppeteer from 'puppeteer';
import { Request, Response, NextFunction, Router } from 'express';
import {SendEmailsModel} from'../../db/models/sendemails.model';
import FilesHandler from '../handlers/files.handler';

class TrackerController {

    public router = Router(); 
    private files = new FilesHandler();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get('/openurl',this.tracker.bind(this));
        this.router.get('/exportUsersOpenLink',this.export.bind(this));
    }

    
    private async tracker(request: Request, response: Response, next: NextFunction){
        try{
            const corse = await SendEmailsModel.findById(request.query.id);
            const update = {
                _id:corse?._id,
                opened:true,
                getter:corse?.getter
            }
            await SendEmailsModel.findOneAndUpdate({_id:update._id},{ $set: update });
            return response.status(200).redirect('http://www.moveo.co.il');
        }catch(err){
          next(err);
        }
      }
      private async export(request: Request, response: Response, next: NextFunction){
        const pipeline = [
            {
                $match:{opened:true}
            },
            {
                
                $lookup:{
                    from:'users',
                    localField: 'getter',
                    foreignField:'_id',
                    as:'getter'
                }
            },
            {
                $unwind:'$getter'
            },
            {
                $project:{
                    _id:false,
                    mailID:'$_id',
                    FullName:'$getter.FullName',
                    EmailAddress:'$getter.EmailAddress',
                    lastClickedOnLink:'$updatedAt'
                }
            }
        ]
        try{
            const opener = await SendEmailsModel.aggregate(pipeline).exec();
            if (opener.length>0){
                if (await this.files.fileExists('./',process.env.EXPORT_FILE_NAME)){
                    await this.files.removeFile('',process.env.EXPORT_FILE_NAME);
                }
                const keys = Object.keys(opener[0]);
                const csv = opener.map((user:any)=>{
                    return keys.map((key:any)=>{
                        return JSON.stringify(user[key])
                    }).join(',');
                });
                csv.unshift(keys.join(','));
                const csvFile = csv.join('\n');
                await this.files.saveToFile(process.env.EXPORT_FILE_NAME,csvFile);
                return response.status(200).download('./'+process.env.EXPORT_FILE_NAME);
            }
        }catch(err){
            next(err);
        }
      }
}

export default TrackerController;