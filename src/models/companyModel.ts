import { DataTypes, Model } from 'sequelize';
import { db } from '../config';
import { CompanyAttributes } from '../utils/types';


export class CompanyModel extends Model<CompanyAttributes> { }

CompanyModel.init(
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
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		isActive: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{
		sequelize: db,
		tableName: 'companies',
		timestamps: true,
		indexes: [
			{
				unique: true,
				fields: ['id']
			},
		]
	}
);