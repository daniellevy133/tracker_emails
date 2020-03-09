import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import ISchema from '../../generics/baseInterface.interface';
import { Mesh, StrongSchema, createStrongSchema } from '../../ts-coverage';

export interface SendEmailsDocument extends ISchema
  {
    getter:Types.ObjectId,
    opened:Boolean
   };

   class SendEmailsMethods {
    /**
     * print this doc _id.
     */
	//  printId: BoundTo<IUserModel> = function() { console.log(this._id); };
	// more methods ...
  }  

  const SendEmailsSchema = createStrongSchema(({
    getter:{type: Types.ObjectId,ref:'Users',require:true},
    opened:{type: Boolean,require:true,default:false}
  } as StrongSchema<SendEmailsDocument>), new SendEmailsMethods(), { timestamps: true })

export type ISendEmailsModel = Mesh<SendEmailsDocument, SendEmailsMethods, mongoose.Document>;

export const SendEmailsModel = mongoose.model<ISendEmailsModel>('SendEmails', SendEmailsSchema);