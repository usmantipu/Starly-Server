import { firebaseAdmin } from '../config/firebase.js'

class FirebaseAdminUtils {
	public async getAllUserTokens() {
		const userTokensSnapshot = await firebaseAdmin
			.firestore()
			.collection('Users')
			.get()

		const allUserTokens = userTokensSnapshot.docs.map((user) => {
			return user.data().fcm
		})

		return allUserTokens.filter((e) => e !== '')
	}

	public async getAllFollowersToken(userId: string) {
		const userCol = firebaseAdmin.firestore().collection('Users')

		const followersDoc = await userCol
			.where('following', 'array-contains', userId)
			.get()

		const allUserTokens = followersDoc.docs.map((user) => {
			return user.data().fcm
		})

		return allUserTokens.filter((e) => e !== '' && e)
	}
	public chunkArray<T>(array: T[], size: number): T[][] {
		const chunkedArray: T[][] = []
		for (let i = 0; i < array.length; i += size) {
			chunkedArray.push(array.slice(i, i + size))
		}
		return chunkedArray
	}
}

export default new FirebaseAdminUtils()
