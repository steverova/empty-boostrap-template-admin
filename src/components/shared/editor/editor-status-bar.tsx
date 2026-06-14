import type { Editor } from '@tiptap/react'
import { charCount, statusBar } from './editor.styles.css'

type EditorStatusBarProps = {
	editor: Editor
	characterLimit?: number | null
}

export default function EditorStatusBar({
	editor,
	characterLimit,
}: EditorStatusBarProps) {
	const chars =
		editor.storage.characterCount?.characters?.() ?? editor.getText().length
	const words = editor.getText().split(/\s+/).filter(Boolean).length
	const isNearLimit = characterLimit ? chars >= characterLimit * 0.9 : false

	return (
		<div className={statusBar}>
			<span>
				{words} palabras · {chars} caracteres
			</span>
			{characterLimit && (
				<span className={charCount[isNearLimit ? 'limit' : 'normal']}>
					{chars} / {characterLimit}
				</span>
			)}
		</div>
	)
}
