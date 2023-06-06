import bcrypt from 'bcrypt'
import { permissions } from './utils/permissionList';
import { RoleModel, UserModel } from './models';
import { db } from "./config";
import app from "./app";
import dotenv from "dotenv";
import { logger } from "./utils/logger";

dotenv.config();

db.sync().then(() => {
	logger.info("connect to db")
	//initial();
}).catch((err: any) => {
	logger.error("Error connecting to db:", err)

});


const port = process.env.PORT;

app.listen(port, () => {
	logger.info("server is running on port " + port)
});

const initial = async () => {
	await RoleModel.create({
		id: 1,
		name: "superadmin",
		description: 'Superadmin Role',
		permissions: permissions
	}).then(async (data: any) => {
		await UserModel.create({
			id: 1,
			name: 'Super',
			surname: 'Admin',
			email: 'superadmin@gmail.com',
			password: await bcrypt.hash('123456', 10),
			isVerified: true,
			roleId: data.id
		})
	});
}
