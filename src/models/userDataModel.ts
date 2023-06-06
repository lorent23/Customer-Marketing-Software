import { DataTypes, Model } from 'sequelize';
import { db } from '../config';
import { userDataAttributes } from '../utils/types';
import { ipDataModel } from './ipDataModel';

export class userDataModel extends Model<userDataAttributes> { }

userDataModel.init(
    {
        sessionid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        timestamp: {
            type: DataTypes.DECIMAL(38, 0),
            allowNull: false
        },
        href: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: true
        },
        architecture: {
            type: DataTypes.STRING,
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: true
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullVersionList: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        preUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
		sequelize: db,
		tableName: 'session_data',
		timestamps: true,
		indexes: [
			{
				unique: true,
				fields: ['sessionid']
			},
		]
	}
);
userDataModel.belongsTo(ipDataModel, { as: 'ip_data'});
ipDataModel.hasMany(userDataModel, { as:"session", foreignKey: 'query' });