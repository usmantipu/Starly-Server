import * as dotenv from 'dotenv'
dotenv.config()

const environments = {
	firebaseProjectId: process.env.firebaseProjectId ?? '',
	firebaseDatabaseUrl: process.env.firebaseDatabaseUrl ?? '',
	FCM_SERVER_KEY: process.env.FCM_SERVER_KEY ?? '',
}

export default environments
