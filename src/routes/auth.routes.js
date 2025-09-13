import { signup, signin, logout } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', (req, res) => signup(req, res));
router.post('/sign-in', (req, res) => signin(req, res));
router.post('/sign-out', (req, res) => logout(req, res));

export default router;
