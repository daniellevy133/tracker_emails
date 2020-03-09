import { Request, Response, Router, NextFunction } from 'express';
import ISchema from './baseInterface.interface';
import { Model } from 'mongoose';


abstract class CrudController {
	public router = Router();
	public t: Model<any>;
	protected baseSort: {} | undefined;

	constructor() {
		this.initializeRoutes();
        this.t = this.getSchema();
	}

	protected abstract initializeRoutes(): void;
	protected abstract getSchema(): Model<any>;

	protected async getAll (request: Request, response: Response, next: NextFunction) {
		request;
		try {
			const query = this.t.find().lean();
			if (this.baseSort) {
				query.sort(this.baseSort);
			}
			const items = await query.exec();
			response.send(items);
		} catch (error) {
			next(error);
		}
	}
	
	async create(request: Request, response: Response, next: NextFunction) {
		const itemData: ISchema = request.body;
		var mod = this.getSchema()
		const createdItem = new mod(itemData);
		try {
			const newItem = await createdItem.save();
			response.send(newItem);
		} catch (error) {
			next(error);
		}
	}

	async delete(request: Request, response: Response, next: NextFunction) {
		const itemId: ISchema = request.query.itemId;
		try {
			const updated = await this.t.deleteOne({ _id: itemId }).lean().exec();
			response.send(updated)
		} catch (error) {
			next(error);
		}
	}

	async update(request: Request, response: Response, next: NextFunction) {
		const itemData: ISchema = request.body;
		console.log(itemData);
		try {
			const updated = await this.t.findOneAndUpdate({ _id: itemData._id }, { $set: itemData }).lean().exec();
			response.send(updated)
		} catch (error) {
			next(error);
		}
	}
}


export default CrudController;
