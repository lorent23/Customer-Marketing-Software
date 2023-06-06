import { Request, Response } from "express";
import { RoleModel } from "../models";
import Joi from 'joi';
import { successResponse, schemaFailResponse } from './../utils/formatResponse';
import { logger } from '../utils/logger';
import { getPagination, paginate } from '../utils';

class RoleController {
	async create(req: Request, res: Response) {
		try {
			const schema = Joi.object({
				name: Joi.string().required(),
				description: Joi.string(),
				permissions: Joi.array().items(Joi.string()).required(),
			});
			const { error } = schema.validate(req.body);
			if (error) return schemaFailResponse(req, res, error.details[0].message)
			const record = await RoleModel.create({ ...req.body });
			return successResponse(req, res, record, 201, 'role_created')

		} catch (e) {
			logger.error("Failed to create role", e);
			return res.json({ msg: `fail to create: ${e}`, status: 500 });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const schema = Joi.object({
				id: Joi.number().required(),
			});
			const { error } = schema.validate(req.params);
			if (error) return schemaFailResponse(req, res, error.details[0].message)

			const record = await RoleModel.update({ ...req.body }, { where: { id } });

			return successResponse(req, res, record, 201, 'role_updated')

		} catch (e) {
			logger.error("Failed to update role", e);
			return res.json({ msg: `fail to update: ${e}`, status: 500 });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const row = await RoleModel.findOne({
				where: { id },
			});

			if (row) {
				await row.destroy(); // deletes the row
				return successResponse(req, res, row, 201, 'role_deleted')
			} else {
				return res.json({ msg: `Role not found!`, status: 404 });
			}


		} catch (e) {
			logger.error("Failed to delete role", e);
			return res.json({ msg: `fail to delete: ${e}`, status: 500 });
		}
	}

	async readByID(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const record = await RoleModel.findOne({ where: { id } });
			return successResponse(req, res, record, 200)
		} catch (e) {
			logger.error("Failed to read role by id", e);
			return res.json({ msg: "fail to read", status: 500 });
		}
	}

	async readAll(req: Request, res: Response) {
		try {
			const { page, orderBy = 'updatedAt', direction = 'DESC' } = req.query;
			const { limit, offset } = getPagination(req.query);
			const roles = await RoleModel.findAndCountAll({
				limit, offset,
				order: [[`${orderBy}`, `${direction}`]]
			});
			const { totalItems, currentPage, data, totalPages } = paginate(roles, page, limit);

			return successResponse(req, res, { data, meta: { totalItems, currentPage, totalPages } }, 200)
		} catch (e) {
			logger.error("Failed to read all roles", e);
			return res.json({ msg: "fail to read all roles", status: 500 });
		}
	}

}

export default new RoleController();