import express from 'express';
import { userDataController } from '../controllers';

const router = express.Router();

router.post('/', userDataController.create);

router.get('/', userDataController.readAll);

router.delete('/:id', userDataController.delete);
export default router; 