// import { captureException } from '@sentry/node'
import axios from 'axios'
import environments from '../config/environments.js'

const PushNotification = async (
	title: string,
	body: string,
	fcmToken: string | null | undefined,
	{
		data,
		icon,
		image,
		sound,
	}: {
		data?: any
		icon?: string
		image?: string
		sound?: string
	}
) => {
	if (!title || !body || !fcmToken) return
	const link = 'https://fcm.googleapis.com/fcm/send'
	try {
		const response = await axios.post(
			link,
			{
				notification: {
					body,
					title,
					sound: sound ?? 'default',
					icon: icon ?? 'app_icon',
					image: image,
				},
				priority: 'high',
				data: data ?? {},
				to: fcmToken,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `key=${environments.FCM_SERVER_KEY}`,
				},
			}
		)

		return response.data
	} catch (error) {
		// captureException(error)
		console.log(error)
	}
}

export default PushNotification
