import express from 'express';
import { register, login } from '../controllers/registrantController';
import { transfer, updateTransferStatus, getAllTransfers } from '../controllers/transferController';
;

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/transfer', transfer);
router.patch('/transfer/:id', updateTransferStatus);
router.get('/transfer', getAllTransfers);

export default router;