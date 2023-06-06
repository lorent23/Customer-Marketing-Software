import { successResponse } from './../utils/formatResponse';
import { Request, Response } from "express";
import { CompanyModel } from "../models";
import { getPagination, paginate } from '../utils';
class CompanyController {
	async create(req: Request, res: Response) {
		try {
			const record = await CompanyModel.create({ ...req.body });
			return successResponse(req, res, { data: record }, 201, 'company_created')

		} catch (e) {
			return res.json({ msg: `fail to create: ${e}`, status: 500 });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await CompanyModel.update({ ...req.body }, { where: { id } });
			return successResponse(req, res, record, 201, 'company_updated')

		} catch (e) {
			return res.json({ msg: `fail to create: ${e}`, status: 500 });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const row = await CompanyModel.findOne({
				where: { id },
			});

			if (row) {
				await row.destroy(); // deletes the row
				return successResponse(req, res, row, 201, 'company_deleted')
			} else {
				return res.json({ msg: `Role not found!`, status: 404 });
			}


		} catch (e) {
			return res.json({ msg: `fail to create: ${e}`, status: 500 });
		}
	}

	async readByID(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await CompanyModel.findOne({ where: { id } });
			return successResponse(req, res, record, 200)
		} catch (e) {
			return res.json({ msg: "fail to read", status: 500 });
		}
	}

	async readAll(req: Request, res: Response) {
		try {
			const { page, orderBy = 'updatedAt', direction="DESC" } = req.query;
			const { limit, offset } = getPagination(req.query);
			const companies = await CompanyModel.findAndCountAll({
				limit, offset,
				order: [[`${orderBy}`, `${direction}`]]
			});
			const { totalItems, currentPage, data, totalPages } = paginate(companies, page, limit);
			return successResponse(req, res, { data, meta: { totalItems, currentPage, totalPages } }, 200, 'companies_retrieved')
		} catch (e) {
			return res.json({ msg: `fail to read: ${e}`, status: 500 });
		}
	}

}

export default new CompanyController();