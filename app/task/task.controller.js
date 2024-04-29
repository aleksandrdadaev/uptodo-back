import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

// @desc 		Get tasks
// @route 	GET /api/tasks/:date/:sort
// @access	Private
export const getTasks = asyncHandler(async (req, res) => {
	const tasks = await prisma.task.findMany({
		where: {
			userId: req.userId,
			date: req.params.date
		},
		orderBy: {
			[req.params.sort]: req.params.sort === 'priority' ? 'desc' : 'asc'
		},
		include: {
			category: true
		}
	})

	res.json(tasks)
})

// @desc 		Get task
// @route 	GET /api/task/:id
// @access	Private
export const getTask = asyncHandler(async (req, res) => {
	const task = await prisma.task.findUnique({
		where: {
			id: +req.params.id
		},
		include: {
			category: true
		}
	})

	res.json(task)
})

// @desc 		Create task
// @route 	POST /api/tasks
// @access	Private
export const createTask = asyncHandler(async (req, res) => {
	const { title, description, date, time, priority, isCompleted, categoryId } =
		req.body

	const task = await prisma.task.create({
		data: {
			user: {
				connect: {
					id: req.userId
				}
			},
			title,
			description,
			date,
			time,
			priority,
			isCompleted,
			category: {
				connect: {
					id: categoryId
				}
			}
		}
	})
	if (!task) {
		res.status(400)
		throw new Error('Произошла ошибка при создании задачи!')
	}

	res.json(task)
})

// @desc 		Update task
// @route 	PUT /api/tasks/:id
// @access	Private
export const updateTask = asyncHandler(async (req, res) => {
	const { title, description, date, time, priority, categoryId, isCompleted } =
		req.body

	const task = await prisma.task.update({
		where: {
			id: +req.params.id
		},
		data: {
			title,
			description,
			date,
			time,
			priority,
			isCompleted,
			category: {
				connect: {
					id: categoryId
				}
			}
		}
	})
	if (!task) {
		res.status(400)
		throw new Error('Произошла ошибка при обновлении задачи!')
	}

	res.json(task)
})

// @desc 		Delete task
// @route 	DELETE /api/tasks/:id
// @access	Private
export const deleteTask = asyncHandler(async (req, res) => {
	try {
		await prisma.task.delete({
			where: {
				id: +req.params.id
			}
		})

		res.json({ message: 'Задача успешно удалена' })
	} catch (error) {
		res.status(400)
		throw new Error('Произошла ошибка при удалении задачи!')
	}
})

// @desc 		Complete task
// @route 	PATCH /api/tasks/:id
// @access	Private
export const completeTask = asyncHandler(async (req, res) => {
	const { isCompleted } = req.body
	const task = await prisma.task.update({
		where: {
			id: +req.params.id
		},
		data: {
			isCompleted
		}
	})
	if (!task) {
		res.status(400)
		throw new Error('Произошла ошибка при обновлении задачи!')
	}

	res.json(task)
})

// @desc 		Delete all tasks
// @route 	DELETE /api/tasks
// @access	Private
export const deleteAll = asyncHandler(async (req, res) => {
	await prisma.task.deleteMany()

	res.json({ message: 'Задачи удалены' })
})
