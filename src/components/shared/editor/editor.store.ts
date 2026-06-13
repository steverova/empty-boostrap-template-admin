import { create } from 'zustand'
import type { EditorState } from './editor.types'

export const useEditorStore = create<EditorState>((set) => ({
	editor: null,
	setEditor: (editor) => set({ editor }),
}))

export function useEditorInstance() {
	return useEditorStore((s) => s.editor)
}
