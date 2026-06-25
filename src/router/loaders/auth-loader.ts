import { redirect } from 'react-router'
import { getMe } from '@/pages/signin/signin.queries'

export async function authLoader() {
	try {
		const user = await getMe()
		if (user) return redirect('/')
		return null
	} catch {
		return null
	}
}
