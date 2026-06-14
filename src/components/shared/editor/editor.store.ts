import { create } from 'zustand'
import type { EditorState } from './editor.types'

export const useEditorStore = create<EditorState>((set) => ({
	editor: null,
	setEditor: (editor) => set({ editor }),
	containerWidth: 'auto',
	setContainerWidth: (containerWidth) => set({ containerWidth }),
}))

export function useEditorInstance() {
	return useEditorStore((s) => s.editor)
}
