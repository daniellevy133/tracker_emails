import {SendEmailsModel} from '../../db/models/sendemails.model'
import {UserModel} from '../../db/models/user.model'
import { Types } from 'mongoose';
import * as nodemailer from 'nodemailer';


class SendEmailHandler {

	private hbs = require('nodemailer-express-handlebars');

    async createSendMail(getter:string){
		try {
			const getterInfo = await UserModel.find({EmailAddress:getter});
			if (getterInfo.length!=0){
				const sendmail = new SendEmailsModel({getter:getterInfo[0].id});
				await this.sendMail({mail:"danielevy133@gmail.com",pass:"Cj0y46tt"},
									{mail:getterInfo[0].EmailAddress,name:getterInfo[0].FullName},
									sendmail._id,'test');
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

	private async sendMail(sender:{mail:string,pass:string}, getter:{mail:string,name:string},id:string,subject?:string){
		var smtpTransposrt = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user:sender.mail,
				pass:sender.pass
			}
			});
			const handlebarOptions = {
				viewEngine: {
				  extName: '.hbs',
				  partialsDir: './AppPages',
				  layoutsDir: './AppPages',
				  defaultLayout: 'emailPage',
				}, 
				viewPath: './AppPages',
				extName: '.hbs',
			  };
			smtpTransposrt.use('compile',this.hbs(
				handlebarOptions
			));
			try{
				const mailOptions = { 
				  from : sender.mail, 
				  to : getter.mail,
				  subject:subject,
				  template:'emailPage',
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