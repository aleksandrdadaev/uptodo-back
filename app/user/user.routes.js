import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	changeUserEmail,
	changeUserImage,
	changeUserName,
	changeUserPassword,
	getUserImage,
	getUserProfile
} from './user.controller.js'

const router = express.Router()

router.route('/profile').get(protect, getUserProfile)
router.route('/name').patch(protect, changeUserName)
router.route('/email').patch(protect, changeUserEmail)
router.route('/password').patch(protect, changeUserPassword)
router
	.route('/image')
	.get(protect, getUserImage)
	.patch(protect, changeUserImage)

export default router
