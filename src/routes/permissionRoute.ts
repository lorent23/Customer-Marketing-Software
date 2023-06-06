import express from 'express';
import { permissionController } from '../controllers';

const router = express.Router();

router.get(
	'/',
	permissionController.readAll
);

export default router;
