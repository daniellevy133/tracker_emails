import {SendEmailsModel} from '../../db/models/sendemails.model'
import {UserModel} from '../../db/models/user.model'
import { Types } from 'mongoose';
import * as nodemailer from 'nodemailer';
import * as config from 'config';


class SendEmailHandler {

	private hbs = require('nodemailer-express-handlebars');

    async createSendMail(getter:string){
		try {
			const getterInfo = await UserModel.find({EmailAddress:getter});
			if (getterInfo.length!=0){
				const sendmail = new SendEmailsModel({getter:getterInfo[0].id});
				await this.sendMail({mail:getterInfo[0].EmailAddress,name:getterInfo[0].FullName},sendmail._id);
				await sendmail.save();
				return getterInfo[0].FullName;
			}else{
				throw "user dosen't exists"
			}
		} catch (err) {
			throw err;
		}
	}
	
	async checkStatusMail(emailId:Types.ObjectId){
		try{
			const item = await SendEmailsModel.findById(emailId)
			const getter = await UserModel.findById(item?.getter);
			let text:string= "the user "+getter?.FullName;
			if (item?.opened){
				text = text+" opened the mail";
			}else{
				text = text+" didn't open the mail"
			}
			return text;
		}catch(err){
			throw err;
		}
	}

	private async sendMail(getter:{mail:string,name:string},id:string){
		const mailSender = config.get('SendMail.EmailSender') as {[key: string]: string};
		const mailBody = config.get('SendMail.Body') as {[key: string]: string};
		var smtpTransposrt = nodemailer.createTransport({
			service: mailSender.service,
			auth: {
				user:mailSender.user,
				pass:mailSender.pass
			},
			tls:{
				rejectUnauthorized:false
			},
			secure: true,
			port:465 
			});
			const handlebarOptions = {
				viewEngine: {
				  extName: '.hbs',
				  partialsDir: mailBody.pathOfPage,
				  layoutsDir: mailBody.pathOfPage,
				  defaultLayout: mailBody.page,
				}, 
				viewPath: mailBody.pathOfPage,
				extName: '.hbs',
			  };
			smtpTransposrt.use('compile',this.hbs(
				handlebarOptions
			));
			try{
				const mailOptions = { 
				  from : mailSender.user, 
				  to : getter.mail,
				  subject:mailBody.subject,
				  template:mailBody.page,
				  context: {
					FullName:getter.name,
					mailID: id,
				  }
				}; 
				return await smtpTransposrt.sendMail(mailOptions);
			}catch(err){
				throw err;
			}
	}

	
}

export default SendEmailHandler;