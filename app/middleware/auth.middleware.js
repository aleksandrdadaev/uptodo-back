import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user-fields.util.js'

export const protect = asyncHandler(async (req, res, next) => {
	let token

	if (req.headers.authorization?.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1]
		const decoded = jwt.verify(token, process.env.JWT_SECRET_WORD)

		const userFound = await prisma.user.findUnique({
			where: {
				id: decoded.userId
			},
			select: {
				id: true
			}
		})

		if (userFound) {
			req.userId = userFound.id
			next()
		} else {
			res.status(401)
			throw new Error('Неверный токен!')
		}
	}

	if (!token) {
		res.status(401)
		throw new Error('Вы не авторизованы!')
	}
})
