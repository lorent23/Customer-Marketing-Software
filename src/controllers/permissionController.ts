import { successResponse } from './../utils/formatResponse';
import { Request, Response } from "express";
import { permissions } from '../utils/permissionList';

class PermissionController {

	async readAll(req: Request, res: Response) {
		try {
			const record = permissions
			return successResponse(req, res, record, 200)
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500, route: "/:id" });
		}
	}

}

export default new PermissionController();