import { StrictMode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist/wght.css';
import './index.css'
import { RouterProvider } from 'react-router'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { AlertDialogProvider } from '@providers/AlertDialogProvider.tsx'
import { ToastProvider } from '@providers/ToastProvider.tsx'
import { ThemeModeProvider } from '@providers/theme-mode/theme-mode.provider.tsx'
import { router } from '@router'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ToastProvider>
			<ThemeModeProvider>
				<AlertDialogProvider>
					<NuqsAdapter>
						<RouterProvider router={router} />
					</NuqsAdapter>
				</AlertDialogProvider>
			</ThemeModeProvider>
		</ToastProvider>
	</StrictMode>,
)
