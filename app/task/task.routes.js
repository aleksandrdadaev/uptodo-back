import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	completeTask,
	createTask,
	deleteAll,
	deleteTask,
	getTask,
	getTasks,
	updateTask
} from './task.controller.js'

const router = express.Router()

router.route('/').post(protect, createTask).delete(deleteAll)
router.route('/:date/:sort').get(protect, getTasks)
router.route('/task/:id').get(protect, getTask)

router
	.route('/:id')
	.delete(protect, deleteTask)
	.put(protect, updateTask)
	.patch(protect, completeTask)

export default router
