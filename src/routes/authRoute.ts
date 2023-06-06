import express from 'express';
import { authController } from '../controllers';

const router = express.Router();


router.get(
	'/verify-email/:userId/:token',
	authController.verifyEmail
);

/**
 * @swagger
 * /api/auth/login:
 * 		post:
 * 			summary: Login a user
 * 			tags: [Auth]
 * 			parameters:
 * 				- in: body
 * 					name: body
 * 					description: The user to login.
 * 					schema:
 * 						type: object
 * 						required:
 * 							- email
 * 							- password
 * 						properties:
 * 							email:
 * 								type: string
 * 							password:
 * 								type: string
 * 			responses:
 * 				200:
 * 					description: The user was successfully logged in.
 * 				500:
 * 					description: Internal server error
 * 
 */

router.post(
	'/login',
	authController.login
);


router.post(
	'/reset-password/:userId/:token',
	authController.resetPassword
);

router.post(
	'/reset-password',
	authController.genereateResetPassword
);



export default router;
