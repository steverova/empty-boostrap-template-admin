import type { Table, VisibilityState } from '@tanstack/react-table'
import { createContext, type JSX, type ReactNode, useContext } from 'react'

interface TableContextType<T> {
	table: Table<T>
}

const TableContext = createContext<TableContextType<unknown> | undefined>(
	undefined
) as React.Context<TableContextType<unknown> | undefined>

interface TableProviderProps<T> {
	children: ReactNode
	table: Table<T>
	columnVisibility: VisibilityState
	setColumnVisibility: (visibility: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void
}

export const TableProvider = <T,>({
	children,
	table
}: TableProviderProps<T>): JSX.Element => {
	return (
		<TableContext.Provider value={{ table } as TableContextType<unknown>}>
			{children}
		</TableContext.Provider>
	)
}

export const useTableContext = <T,>(): TableContextType<T> => {
	const context = useContext(TableContext)
	if (!context) {
		throw new Error('useTableContext must be used within a TableProvider')
	}
	return context as TableContextType<T>
}
