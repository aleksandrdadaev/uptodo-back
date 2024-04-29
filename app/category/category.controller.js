import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

// @desc 		Get categories
// @route 	GET /api/categories
// @access	Private
export const getCategories = asyncHandler(async (req, res) => {
	const categories = await prisma.category.findMany({
		where: {
			userId: req.userId
		}
	})

	if (!categories) {
		res.status(404)
		throw new Error('Категории не найдены!')
	}

	res.json(categories)
})

// @desc 		Create category
// @route 	POST /api/categories
// @access	Private
export const createCategory = asyncHandler(async (req, res) => {
	const { name, color } = req.body

	const category = await prisma.category.create({
		data: {
			user: {
				connect: {
					id: req.userId
				}
			},
			name,
			color
		}
	})

	if (!category) {
		res.status(400)
		throw new Error('Произошла ошибка при создании категории!')
	}

	res.json(category)
})

// @desc 		Delete category
// @route 	DELETE /api/categories/:id
// @access	Private
export const deleteCategory = asyncHandler(async (req, res) => {
	try {
		await prisma.category.delete({
			where: {
				id: +req.params.id
			}
		})

		res.json({ message: 'Категория успешно удалена' })
	} catch (error) {
		res.status(400)
		throw new Error('Произошла ошибка при удалении категории!')
	}
})

// @desc 		Delete all categories
// @route 	DELETE /api/categories
// @access	Private
export const deleteAll = asyncHandler(async (req, res) => {
	await prisma.category.deleteMany()

	res.json({ message: 'категории удалены' })
})
