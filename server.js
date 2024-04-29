import 'colors'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import { errorHandler, notFound } from './app/middleware/error.middleware.js'

import authRoutes from './app/auth/auth.routes.js'
import categoryRoutes from './app/category/category.routes.js'
import { prisma } from './app/prisma.js'
import taskRoutes from './app/task/task.routes.js'
import userRoutes from './app/user/user.routes.js'

dotenv.config()

const app = express()

async function main() {
	app.use(cors())
	app.use(express.json())
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	app.use('/api/auth', authRoutes)
	app.use('/api/user', userRoutes)
	app.use('/api/categories', categoryRoutes)
	app.use('/api/tasks', taskRoutes)

	app.use(notFound)
	app.use(errorHandler)
	const PORT = process.env.PORT || 5000

	app.listen(
		PORT,
		console.log(
			`🚀 Сервер запущен в режиме ${process.env.NODE_ENV} на ${PORT} порте`
				.magenta.bold
		)
	)
}

main()
	.then(async () => await prisma.$disconnect())
	.catch(async e => {
		console.log(e)
		await prisma.$disconnect()
		process.exit(1)
	})
