import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as logger from 'morgan';
// import * as cors from 'cors';
//import * as mongoose from 'mongoose';

import ApiRoutes from './api/routes';
//import errorMiddleware from './middleware/error.middleware';

import './db/mongoose-init'; // apply connection

class App {
    public app: express.Application;
    public port:number;

    constructor(port:number){
        this.app=express();
        this.port=port;

        this.initAppUsage();
    }

    private initAppUsage(){
        dotenv.config();
        this.initializeMiddlewares();
        this.initializeRoutes();
        // this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));	
        //this.app.use(cors())

        this.app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
            req;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
            res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
            next();
        });

        //var accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });
//         this.app.use(logger('remote-addr - :remote-user [:date[clf]] \
//                             ":method :url HTTP/:http-version" :status :res[content-length] \
// "                           :referrer" ":user-agent" :response-time ms', {
//                 stream: accessLogStream,
//                 skip: function (req: express.Request, res: express.Response) {
//                     return req.url.startsWith('/test');
//                 }
//             }));
    }

    private initializeRoutes() {
        const apiRoutes = new ApiRoutes();
        this.app.use('/api/', apiRoutes.router);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

}

export default App;