import CrudController from '../../generics/baseCrud.controller';
import { Request, Response, NextFunction } from 'express';
import {UserModel} from'../../db/models/user.model';
import FilesHandler from '../handlers/files.handler';
import * as multer from 'multer';

class UserController extends CrudController{

    private upload =multer({dest:process.env.PATH_OF_SEND_FILE+'/'});
    private files = new FilesHandler();

    protected initializeRoutes(): void {
        this.upload = multer({dest:process.env.PATH_OF_SEND_FILE+'/'});
        this.router.post('/',this.upload.single('file'),this.test.bind(this));
        this.router.get('/', this.getAll.bind(this));
    }    
    protected getSchema(): import("mongoose").Model<any, {}> {
        return UserModel;
    }

    private async test(request: Request, response: Response, next: NextFunction) {
        try{
            const csvFile = await this.files.readCSV(request.file);
            const users =[];
            for (const user of csvFile){
                if (this.files.checkSuffixes(user.EmailAddress,['@moveo.co.il','@moveo.group'])){
                    users.push({
                        FullName:user.FullName,
                        EmailAddress:user.EmailAddress
                    });
                }
            }
            return response.status(200).send(await this.createMany(users));
        } catch (err){
            next(err);
        }
    }

    private async createMany (users:any[]){
        const promises:any[] = [];
        users.map(user=>{
            try {
                const createdItem = new UserModel(user);
                promises.push(createdItem.save());
            } catch (err) {
			    throw err;
		    }
        });
        return await Promise.all(promises);
    }


}

export default UserController;