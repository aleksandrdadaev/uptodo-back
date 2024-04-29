import { hash, verify } from 'argon2'
import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user-fields.util.js'

// @desc 		Get user profile
// @route 	GET /api/user/profile
// @access	Private
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.userId
		},
		select: UserFields
	})
	if (!user) {
		res.status(404)
		throw new Error('Пользователь не найден!')
	}

	const done = await prisma.task.count({
		where: {
			userId: req.userId,
			isCompleted: true
		}
	})
	const left = await prisma.task.count({
		where: {
			userId: req.userId,
			isCompleted: false
		}
	})

	res.json({
		...user,
		statistics: {
			done,
			left
		}
	})
})

// @desc 		Get user image
// @route 	GET /api/user/image
// @access	Private
export const getUserImage = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.userId
		},
		select: {
			image: true
		}
	})
	if (!user) {
		res.status(404)
		throw new Error('Пользователь не найден!')
	}

	res.json(user)
})

// @desc 		Change user name
// @route 	PATCH /api/user/name
// @access	Private
export const changeUserName = asyncHandler(async (req, res) => {
	const { name } = req.body

	const user = await prisma.user.update({
		where: {
			id: req.userId
		},
		data: {
			name
		},
		select: UserFields
	})
	if (!user) {
		res.status(404)
		throw new Error('Пользователь не найден!')
	}

	res.json(user)
})

// @desc 		Change user email
// @route 	PATCH /api/user/email
// @access	Private
export const changeUserEmail = asyncHandler(async (req, res) => {
	const { email } = req.body

	const isHaveUser = await prisma.user.findUnique({
		where: {
			email
		}
	})
	if (isHaveUser) {
		res.status(400)
		throw new Error('Email занят!')
	}

	const user = await prisma.user.update({
		where: {
			id: req.userId
		},
		data: {
			email
		},
		select: UserFields
	})
	if (!user) {
		res.status(404)
		throw new Error('Пользователь не найден!')
	}

	res.json(user)
})

// @desc 		Change user password
// @route 	PATCH /api/user/password
// @access	Private
export const changeUserPassword = asyncHandler(async (req, res) => {
	const { password, newPassword } = req.body

	// Проверка на одинаковый пароль, либо здесь, либо на фронте (надо протестить)

	const userFound = await prisma.user.findUnique({
		where: {
			id: req.userId
		}
	})
	if (!userFound) {
		res.status(404)
		throw new Error('Пользователь не найден!')
	}

	const isValidPassword = await verify(userFound.password, password)
	if (!isValidPassword) {
		res.status(401)
		throw new Error('Неверный пароль!')
	}

	const user = await prisma.user.update({
		where: {
			id: req.userId
		},
		data: {
			password: await hash(newPassword)
		},
		select: UserFields
	})
	if (!user) {
		res.status(404)
		throw new Error('Пользователь не найден!')
	}

	res.json(user)
})

// @desc 		Change user image
// @route 	PATCH /api/user/image
// @access	Private
export const changeUserImage = asyncHandler(async (req, res) => {
	const { image } = req.body

	const user = await prisma.user.update({
		where: {
			id: req.userId
		},
		data: {
			image
		},
		select: UserFields
	})
	if (!user) {
		res.status(404)
		throw new Error('Пользователь не найден!')
	}

	res.json(user)
})
