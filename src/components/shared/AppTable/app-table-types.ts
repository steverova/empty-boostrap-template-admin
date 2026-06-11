import type {
  ColumnDef,
  Row
} from '@tanstack/react-table'
import type { ReactNode } from 'react'

export type RowData = Record<string, unknown>

export type AppTableProps<T = Record<string, unknown>> = {
  showExport?: boolean
  otherActions?: React.ReactNode
  onAdd?: null | (() => void)
  enableActions?: boolean
  skeletonRows?: number
  refetchData?: () => void
  defaultPageSize?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  tableName?: string
  rowActions?: (row: Row<T>) => ReactNode[]
  elevation?: 1 | 2 | 3 | 4 | 5 | null
  columns?: Array<ColumnDef<T>>
  data?: Array<T>
  isLoading?: boolean
  enableClickToCopy?: boolean
  columnVisibility?: Record<string, boolean>
}

export interface RowActionsProps<TData extends RowData = RowData> {
  row: Row<TData>
  rowActions: (row: Row<TData>) => ReactNode[]
  loading: boolean
}



