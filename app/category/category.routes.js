import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createCategory,
	deleteAll,
	deleteCategory,
	getCategories
} from './category.controller.js'

const router = express.Router()

router
	.route('/')
	.get(protect, getCategories)
	.post(protect, createCategory)
	.delete(deleteAll)

router.route('/:id').delete(protect, deleteCategory)

export default router
