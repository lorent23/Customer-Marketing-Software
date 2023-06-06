import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import { RoleModel } from '../models';
import { UserModel } from './../models/userModel';
import { schemaFailResponse } from '../utils/formatResponse';

dotenv.config();

const secretKey: any = process.env.JWT_SECRET


const checkDuplicateEmail = (req: any, res: any, next: any) => {
  const { email } = req.body
  if (!email) return schemaFailResponse(req, res, 'Email is required')
  // Email
  UserModel
    .findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
};

const verifyToken = (req: any, res: any, next: any) => {
  let token = req.headers.authorization || req.headers.Authorization;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  const bearer = token.split(' ')
  const bearerToken = bearer[1]

  jwt.verify(bearerToken, secretKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.user = decoded.user;
    next();
  });
};

const hasPermission = (permissions: string[]) => {
  return (req: any, res: any, next: any) => {

    const { id } = req.user
    if (!id) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    // Email
    UserModel
      .findOne({
        where: {
          id
        },
        include: { model: RoleModel, as: 'role' }
      }).then((user: any) => {
        const permissionList = user.role.permissions
        const checkPermission = permissionList.indexOf(permissions[0]) > -1
        if (!checkPermission) {
          res.status(409).send({
            message: "Failed! You dont have permissions!"
          });
          return;
        }

        next();
      });
  }

};

export {
  hasPermission,
  checkDuplicateEmail,
  verifyToken
}