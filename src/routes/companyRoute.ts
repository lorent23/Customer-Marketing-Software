import express from 'express';
import { companyController } from '../controllers';
import { hasPermission, verifyToken } from '../middleware/auth';

const router = express.Router();

router.get(
	'/:id',
	[
		verifyToken,
		hasPermission(['company_view']),
	],
	companyController.readByID
);

router.get(
	'/',
	[
		verifyToken,
		hasPermission(['company_list']),
	],
	companyController.readAll
);

router.post(
	'/',
	[
		verifyToken,
		hasPermission(['company_create']),
	],
	companyController.create
);

router.put(
	'/:id',
	[
		verifyToken,
		hasPermission(['company_update']),
	],
	companyController.update
);

router.delete(
	'/:id',
	[
		verifyToken,
		hasPermission(['company_delete']),
	],
	companyController.delete
);


export default router;