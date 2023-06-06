import { successResponse } from './../utils/formatResponse';
import { Request, Response } from "express";
import { getPagination, paginate } from '../utils';
import { ipDataModel } from '../models/ipDataModel';
import { userDataModel } from '../models/userDataModel';
import { logger } from '../utils/logger';


class ipDataController{
    async create (req: Request, res: Response){
        try{
            const record = await ipDataModel.create({...req.body});
            return successResponse(req, res, {data:record}, 201, 'IP data added successfully');
        }catch(error){
            logger.error("Error: ", error);
            res.json({message: req.t('ipDataFailedToCreate')})
        }
    }

    async readAll (req: Request, res: Response){
        try{
            const {page, orderBy = 'updatedAt', direction='DESC' } = req.query;
            const {limit, offset} = getPagination(req.query);
            const ipData = await ipDataModel.findAndCountAll({
                limit, offset,
                order: [[`${orderBy}`, `${direction}`]],
            });
            const {totalItems, currentPage, data, totalPages} = paginate(ipData, page, limit);
            return successResponse (req, res, {data, meta: {totalItems, currentPage, totalPages}}, 200, 'IP Data retrieved successfully');
        }catch(error){
            logger.error("Error: ", error);
            res.json({message: req.t('ipDataFailedToGet')})
        }
    }

    async readAllSession (req: Request, res: Response){
        try{
            const {page, orderBy = 'updatedAt', direction='DESC' } = req.query;
            const {limit, offset} = getPagination(req.query);
            const ipData = await ipDataModel.findAndCountAll({
                limit, offset,
                order: [[`${orderBy}`, `${direction}`]],
                include: [{model: userDataModel, as: 'session'}],
            });
            const {totalItems, currentPage, data, totalPages} = paginate(ipData, page, limit);
            return successResponse (req, res, {data, meta: {totalItems, currentPage, totalPages}}, 200, 'IP Data retrieved successfully');
        }catch(error){
            logger.error("Error: ", error);
            res.json({message: req.t('ipDataFailedToGet'), error})
        }
    }
    async delete(req: Request, res: Response){
        try {
            const {query}=req.params;
            const row = await ipDataModel.findOne({
                where: {query}
            });
            if(row){
                await row.destroy();
                return successResponse(req, res, row, 201, 'IP Data Deleted');
            }else{
                return res.json({message: req.t('ipDataNotFound'), status: 404})
            }

        }catch(error){
            logger.error("Error: ", error);
            return res.json({message: req.t('ipDataFailedToDelete'), error, status: 500});
        }
    }

};
export default new ipDataController();