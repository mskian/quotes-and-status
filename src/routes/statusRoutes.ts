import { Router } from 'express';
import { getAllstatus, getStatusById, addStatus } from '../controllers/statusController';

const router: Router = Router();

router.get('/', getAllstatus);
router.get('/:id', getStatusById);
router.post('/', addStatus);

export default router;
