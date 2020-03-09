import * as mongoose from 'mongoose';
import ISchema from '../../generics/baseInterface.interface';
import { Mesh, StrongSchema, createStrongSchema } from '../../ts-coverage';

export interface UserDocument extends ISchema
  {
    FullName:string,
    EmailAddress:string
   };

   class UserMethods {
    /**
     * print this doc _id.
     */
	//  printId: BoundTo<IUserModel> = function() { console.log(this._id); };
	// more methods ...
  }  

  const UserSchema = createStrongSchema(({
    FullName: { type: String, required: true },
    EmailAddress:{ type: String, required: true } 
  } as StrongSchema<UserDocument>), new UserMethods())

export type IUserModel = Mesh<UserDocument, UserMethods, mongoose.Document>;

export const UserModel = mongoose.model<IUserModel>('Users', UserSchema);