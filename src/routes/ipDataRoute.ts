import express from 'express';
import { ipDataController } from '../controllers';

const router = express.Router();

router.get('/', ipDataController.readAll);
router.post('/', ipDataController.create);
router.delete('/:query', ipDataController.delete);
router.get("/user", ipDataController.readAllSession);

export default router;