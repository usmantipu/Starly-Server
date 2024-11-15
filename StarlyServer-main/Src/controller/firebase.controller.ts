import { Request, Response } from 'express'
import { messaging } from 'firebase-admin'
import { firebaseAdmin } from '../config/firebase.js'
import FirebaseAdminUtils from '../utils/adminUtils.js'

const FirebaseController = {
	sendPushNotificationOnNewUser: async (req: Request, res: Response) => {
		try {
			const { userName, imageUrl } = req.body

			// Get all user tokens and filter out any empty or undefined tokens
			const allUserTokens: string[] =
				await FirebaseAdminUtils.getAllUserTokens()
			const tokens = allUserTokens.filter((t) => t && t !== '')

			if (tokens.length > 0) {
				const CHUNK_SIZE = 500
				const tokenChunks = FirebaseAdminUtils.chunkArray(tokens, CHUNK_SIZE)

				// Loop over each chunk of tokens and prepare batch messages
				for (const tokenChunk of tokenChunks) {
					const messages: messaging.Message[] = tokenChunk.map((token) => ({
						notification: {
							title: 'New Live Stream!',
							body: `${userName} has created a new live stream`,
							imageUrl: imageUrl,
						},
						token: token,
					}))

					// Send all messages in the current batch
					const response = await firebaseAdmin.messaging().sendEach(messages)

					console.log(
						`${response.successCount} messages were sent successfully`
					)

					// Process failed messages and identify unregistered tokens
					response.responses.forEach((resp, idx) => {
						if (
							resp.error &&
							resp.error.code === 'messaging/registration-token-not-registered'
						) {
							const invalidToken = tokenChunk[idx]
							console.error('Token not registered:', invalidToken, resp.error)
						}
					})
				}

				res.json({ success: true })
			} else {
				console.warn('No valid tokens available')
				res.json({
					success: false,
					message: 'No valid tokens available.',
				})
			}
		} catch (error) {
			console.error('Error sending push notification:', error)
			res.json({ success: false })
		}
	},

	// send push notifications
	sendPushNotificationOnNewPost: async (req: Request, res: Response) => {
		try {
			const { userName, imageUrl, userId } = req.body
			console.log(req.body)

			// Fetch all tokens of followers
			const allUserTokens: string[] =
				await FirebaseAdminUtils.getAllFollowersToken(userId)

			if (allUserTokens && allUserTokens.length > 0) {
				const CHUNK_SIZE = 500
				const tokenChunks = FirebaseAdminUtils.chunkArray(
					allUserTokens,
					CHUNK_SIZE
				)

				// Loop over each chunk of tokens and prepare batch messages
				for (const tokenChunk of tokenChunks) {
					const messages: messaging.Message[] = tokenChunk.map((token) => ({
						notification: {
							title: 'New Post',
							body: `${userName} has added a new Post`,
							imageUrl: imageUrl,
						},
						token: token,
					}))

					// Send all messages in the current batch
					const response = await firebaseAdmin.messaging().sendEach(messages)

					console.log(
						`${response.successCount} messages were sent successfully`
					)

					// Process failed messages and identify unregistered tokens
					response.responses.forEach((resp, idx) => {
						if (
							resp.error &&
							resp.error.code === 'messaging/registration-token-not-registered'
						) {
							const invalidToken = tokenChunk[idx]
							console.error('Token not registered:', invalidToken, resp.error)
						}
					})
				}

				res.json({ success: true })
			} else {
				console.warn('No valid tokens found for user:', userId)
				res.json({
					success: false,
					message: 'No valid tokens available.',
				})
			}
		} catch (error) {
			console.error('Error sending push notification:', error)
			res.json({ success: false })
		}
	},
}

export default FirebaseController
