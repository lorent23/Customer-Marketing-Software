import { DataTypes, Model } from 'sequelize';
import { db } from '../config';
import { ipDataAttributes } from '../utils/types';
import { userDataModel } from './userDataModel';

export class ipDataModel extends Model<ipDataAttributes> { }

ipDataModel.init(
    {
        query: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        continent: {
            type: DataTypes.STRING,
            allowNull: true
        },
        continentCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        countryCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        region: {
            type: DataTypes.STRING,
            allowNull: true
        },
        regionName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        district: {
            type: DataTypes.STRING,
            allowNull: true
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        lon:{
            type: DataTypes.FLOAT,
            allowNull: true
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        org: {
            type: DataTypes.STRING,
            allowNull: true
        },
        as: {
            type: DataTypes.STRING,
            allowNull: true
        },
        asname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        proxy: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        hosting: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    },
    {
		sequelize: db,
		tableName: 'ip_data',
		timestamps: true,
		indexes: [
			{
				unique: true,
				fields: ['query']
			},
		]
	}
);
