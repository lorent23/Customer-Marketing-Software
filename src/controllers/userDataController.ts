import { successResponse } from './../utils/formatResponse';
import { Request, Response } from "express";
import { getPagination, paginate } from '../utils';
import { userDataModel } from '../models/userDataModel';
import { logger } from '../utils/logger';
import { generateSessionToken, validateSessionToken } from 'session-id-token';
import dotenv from "dotenv";
dotenv.config();

class userDataController{
    async create (req: Request, res: Response) {
        try{
            const {sessionid, timestamp, href, action, architecture, model, platform, fullVersionList, query, preUrl} = req.body
            if(sessionid === null){
            const secretKey: any = process.env.JWT_SECRET
            const sessionToken = generateSessionToken(secretKey);
            const record = await userDataModel.create({sessionid: sessionToken, timestamp, href, action, architecture, model, platform, fullVersionList, query, preUrl});
            return successResponse(req, res, {data: record}, 201, 'Userdata_posted_Successfully');
            }else{
                const record = await userDataModel.create({...req.body});
                return successResponse(req, res, {data: record}, 201, 'Userdata_posted_Successfully');
            }
        }
        catch(error){
            logger.error(`Failed to create ${error}`);
            return res.json({message: req.t('userDataFailed')})
        }
    }

    async readAll(req: Request, res: Response){
        try{
            const {page, orderBy = 'updatedAt', direction='DESC' } = req.query;
            const {limit, offset} = getPagination(req.query);
            const userData = await userDataModel.findAndCountAll({
            limit, offset,
            order: [[`${orderBy}`, `${direction}`]]
        });
        const { totalItems, currentPage, data, totalPages} = paginate(userData, page, limit);
        return successResponse (req, res, { data, meta: {totalItems, currentPage, totalPages}}, 200, 'user_data_retrieved')
    }catch(error){
        logger.error(`Failed to read ${error}`);
        return res.json({message: req.t('userDataFailed')});
    }
    }

    async delete(req: Request, res: Response){
        try {
            const { sessionid } = req.params;
            const row = await userDataModel.findOne({
                where: {sessionid}
            });

            if(row){
                await row.destroy();
                return successResponse(req, res, row, 201, 'user_data_deleted')
            }
            else{
                return res.json({message: "User data not found", status: 404});
            }
        }catch(error){
            return res.json({message: "Failed to delete", error, status: 500})
        }
    }
}

export default new userDataController();