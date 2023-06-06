import { DataTypes, Model } from 'sequelize';
import { db } from '../config';
import { RoleAttributes } from '../utils/types';
import { UserModel } from './userModel';


export class RoleModel extends Model<RoleAttributes> { }

RoleModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		permissions: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
			defaultValue: []
		}
	},
	{
		sequelize: db,
		tableName: 'roles',
		timestamps: true
	}
);