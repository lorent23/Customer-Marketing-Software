import { CompanyModel } from './companyModel';
import { RoleModel } from './roleModel';
import { AccessTokenModel } from './accessTokenModel';
import { DataTypes, Model } from 'sequelize';
import { db } from '../config';
import { UserAttributes } from '../utils/types';


export class UserModel extends Model<UserAttributes> { }

UserModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		surname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{
		sequelize: db,
		tableName: 'users',
		timestamps: true,
		indexes: [
			{
				unique: true,
				fields: ['email']
			},
			{
				unique: true,
				fields: ['id']
			},
		]
	}
);
UserModel.hasOne(AccessTokenModel, { as: 'user', foreignKey: 'userId' })
UserModel.belongsTo(RoleModel, { as: 'role', foreignKey: 'roleId' })
UserModel.belongsTo(CompanyModel, { as: 'company', foreignKey: 'companyId' })