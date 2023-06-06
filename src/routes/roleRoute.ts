import express from 'express';
import { roleController } from '../controllers';
import { hasPermission, verifyToken } from '../middleware/auth';

const router = express.Router();

router.get(
	'/:id',
	[
		verifyToken,
		hasPermission(['role_view']),
	],
	roleController.readByID
);

router.get(
	'/',
	[
		verifyToken,
		hasPermission(['role_list']),
	],
	roleController.readAll
);

router.post(
	'/',
	[
		verifyToken,
		hasPermission(['role_create']),
	],
	roleController.create
);

router.put(
	'/:id',
	[
		verifyToken,
		hasPermission(['role_update']),
	],
	roleController.update
);

router.delete(
	'/:id',
	[
		verifyToken,
		hasPermission(['role_delete']),
	],
	roleController.delete
);


export default router;