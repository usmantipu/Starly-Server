import express from 'express'
import FirebaseController from '../controller/firebase.controller.js'

const router = express.Router()

router.post('/join-stream', FirebaseController.sendPushNotificationOnNewUser)
router.post(
	'/send-notification',
	FirebaseController.sendPushNotificationOnNewPost
)
router.get('/account/delete/:id', (_, res) => {
	res.json({ success: true, message: 'account deleted successfully!' })
})
export default router
