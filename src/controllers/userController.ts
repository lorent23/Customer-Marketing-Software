import { dynamicFilter } from '../utils';
import bcrypt from 'bcrypt'
import * as crypto from "crypto";
import Joi from 'joi';
import dotenv from "dotenv";
import { Request, Response } from "express";
import { successResponse, schemaFailResponse } from './../utils/formatResponse';
import { UserModel, RoleModel, AccessTokenModel } from "../models";
import { sendEmail } from '../utils/mailService';
import { logger } from '../utils/logger';
import { getPagination, paginate } from '../utils';

dotenv.config();

class UserController {
	async create(req: Request, res: Response) {
		try {
			const schema = Joi.object({
				email: Joi.string().email().required(),
				password: Joi.string().min(6).required(),
				roleId: Joi.number().required(),
				companyId: Joi.number().required(),
				name: Joi.string().required(),
				surname: Joi.string().required(),
				isVerified: Joi.boolean().default(false),
			});
			const { error } = schema.validate(req.body);
			if (error) return schemaFailResponse(req, res, error.details[0].message)
			const { email } = req.body;
			const record: any = await UserModel.create({ ...req.body, password: bcrypt.hashSync(req.body.password, 10), isActive: false });

			const token: any = await AccessTokenModel.create({ token: crypto.randomBytes(32).toString('hex'), userId: record.id });

			sendEmail(email, 'Welcome to IpTracker', `Welcome to our platform, please click on the link below to verify your email address: ${process.env.DOMAIN_URL}/verify-email/${record.id}/${token.token}`);

			return successResponse(req, res, record, 201, 'user_created')
		} catch (e) {
			logger.error("Failed to create user", e);
			return res.json({ message: `fail to create: ${e}`, status: 400 });
		}
	}

	async readByID(req: Request, res: Response) {
		try {
			const schema = Joi.object({
				id: Joi.number().required(),
			});
			const { error } = schema.validate(req.params);
			if (error) return schemaFailResponse(req, res, error.details[0].message)
			const { id } = req.params;
			const record = await UserModel.findOne({ where: { id }, include: { model: RoleModel, as: 'role' } });
			return res.json({ data: record });
		} catch (e) {
			logger.error("Failed to read user", e);
			return res.json({ message: `fail to read: ${e}`, status: 400 });
		}
	}

	async me(req: Request, res: Response) {
		try {
			const schema = Joi.object({
				id: Joi.number().required(),
			});
			const { error } = schema.validate(req.params);
			if (error) return schemaFailResponse(req, res, error.details[0].message)
			const { id } = req.params;
			const record = await UserModel.findOne({ where: { id }, include: { model: RoleModel, as: 'role' } });
			return res.json(record);
		} catch (e) {
			logger.error("Failed to read user", e);
			return res.json({ message: `fail to read: ${e}`, status: 400 });
		}
	}

	async readAll(req: Request, res: Response) {
		try {
			const { page, orderBy = 'updatedAt', direction = 'DESC', roleOrder="updatedAt" } = req.query;
			const { limit, offset } = getPagination(req.query);
			const where = dynamicFilter(req.query)
			const users = await UserModel.findAndCountAll({
				limit, offset, attributes: {
					exclude: ['password']
				},
				order: [[`${orderBy}`, `${direction}`]],
				include: [{ model: RoleModel, as: 'role', attributes: ["name", "updatedAt"],
				order: [[`${roleOrder}`, `${direction}`]],
				}],
			});
			const { totalItems, currentPage, data, totalPages } = paginate(users, page, limit);



			return successResponse(req, res, { data, meta: { totalItems, currentPage, totalPages } }, 200, 'users_retrieved')
		} catch (e) {
			logger.error("Failed to read all users", e);
			return res.json({ message: "fail to read", status: 400 });
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
			const record = await UserModel.update({ ...req.body }, { where: { id } });
			return successResponse(req, res, record, 201, 'user_updated')

		} catch (e) {
			logger.error("Failed to update user", e);
			return res.json({ message: `fail to update: ${e}`, status: 400 });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const schema = Joi.object({
				id: Joi.number().required(),
			});
			const { error } = schema.validate(req.params);
			if (error) return schemaFailResponse(req, res, error.details[0].message)
			const row = await UserModel.findOne({
				where: { id },
			});

			if (row) {
				await row.destroy(); // deletes the row
				return successResponse(req, res, row, 201, 'user_deleted')
			} else {
				return res.json({ message: `User not found!`, status: 404 });
			}


		} catch (e) {
			logger.error("Failed to delete user", e);
			return res.json({ message: `fail to delete: ${e}`, status: 400 });
		}
	}

}

export default new UserController();