import { hash, verify } from 'argon2'
import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user-fields.util.js'

import { generateToken } from './generate-token.js'

// @desc 		Auth user
// @route 	POST /api/auth/login
// @access	Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	})
	if (!user) {
		res.status(401)
		throw new Error('Неверный email!')
	}

	const isValidPassword = await verify(user.password, password)
	if (!isValidPassword) {
		res.status(401)
		throw new Error('Неверный пароль!')
	}

	const token = generateToken(user.id)
	res.json({ token })
})

// @desc 		Register user
// @route 	POST /api/auth/register
// @access	Public
export const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const isHaveUser = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (isHaveUser) {
		res.status(400)
		throw new Error('Email занят!')
	}

	const user = await prisma.user.create({
		data: {
			email,
			name: '',
			password: await hash(password),
			image: ''
		}
	})

	const token = generateToken(user.id)

	res.json({ token })
})
