import jwt from 'jsonwebtoken'

export const generateToken = userId =>
	jwt.sign(
		{
			userId
		},
		process.env.JWT_SECRET_WORD,
		{
			expiresIn: '10d'
		}
	)
