import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import * as crypto from "crypto";
import dotenv from "dotenv";
import Joi from 'joi';
import { logger } from '../utils/logger';
import { successResponse, schemaFailResponse } from './../utils/formatResponse';
import { Request, Response } from "express";
import { UserModel, AccessTokenModel } from "../models";
import { sendEmail } from '../utils/mailService';

dotenv.config();

const secretKey: any = process.env.JWT_SECRET

class AuthController {
	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			//find a user by their email
			const user: any = await UserModel.findOne({ where: { email } });

			//if user email is found, compare password with bcrypt
			if (!user) {
				return res.status(401).send({ message: "Authentication failed, email not found" });
			}

			const isSame = await bcrypt.compare(password, user.password);

			if (!isSame) {
				return res.status(401).send({ message: "Authentication failed, password dont match" });
			}

			if (!user.isVerified) {
				return res.status(401).send({ message: 'Your Email has not been verified. Please check your email' });
			}
			//if password is the same
			//generate token with the user's id and the secretKey in the env file

			let token = jwt.sign({ user }, secretKey, {
				expiresIn: 1 * 24 * 60 * 60 * 1000,
			});

			//if password matches wit the one in the database send ok
			const data = {
				user,
				token
			}
			return successResponse(req, res, data, 200)


		} catch (e) {
			logger.error("Failed to login: ", e);
			return res.json({ msg: `Server Error, try again: ${e}`, status: 500 });
		}
	}

	async verifyEmail(req: Request, res: Response) {
		try {
			const user: any = await UserModel.findByPk(req.params.userId);
			if (!user) return res.status(400).send({ message: "User not found" });

			const token: any = await AccessTokenModel.findOne({ where: { userId: user.id, token: req.params.token, } });
			if (!token) return res.status(400).send({ message: "Invalid link or expired" });

			user.isVerified = true
			await user.save();
			await token.destroy();
			return successResponse(req, res, 'Email verified successfully', 200)
		} catch (e) {
			logger.error("Failed to verify email", e);
			return res.status(400).send({ message: "Failed to verify email" });
		}
	}

	async genereateResetPassword(req: Request, res: Response) {
		try {
			const schema = Joi.object({ email: Joi.string().email().required() });
			const { error } = schema.validate(req.body);
			if (error) return res.status(400).send(error.details[0].message);

			const user: any = await UserModel.findOne({ where: { email: req.body.email } });
			if (!user)
				return res.status(400).send({ message: "user with given email doesn't exist" });

			const token: any = await AccessTokenModel.findOrCreate({ where: { userId: user.id, token: crypto.randomBytes(32).toString('hex'), } });

			const link = `${process.env.DOMAIN_URL}/reset-password/${user.id}/${token[0].token}`;
			sendEmail(user.email, "IpTrack: Password reset", link);

			return successResponse(req, res, 'Password link send via mail', 200)
		} catch (error) {
			return res.status(400).send("An error occured");
		}
	}

	async resetPassword(req: Request, res: Response) {
		try {
			const schema = Joi.object({ password: Joi.string().required() });
			const { error } = schema.validate(req.body);
			if (error) return schemaFailResponse(req, res, error.details[0].message)

			const user: any = await UserModel.findByPk(req.params.userId);
			if (!user) return res.status(400).send("User not found");

			const token: any = await AccessTokenModel.findOne({ where: { userId: user.id, token: req.params.token, } });
			if (!token) return res.status(400).send("Invalid link or expired");

			user.password = bcrypt.hashSync(req.body.password, 10)
			await user.save();
			await token.destroy();
			return successResponse(req, res, 'Password reset successfully', 200)
		} catch (e) {
			logger.error("Failed to reset password", e);
			return res.status(400).send("Failed to reset password");
		}
	}
}
export default new AuthController();