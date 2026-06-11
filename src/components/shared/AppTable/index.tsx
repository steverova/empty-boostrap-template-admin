import "./table-styles.css";
import {
	type CellContext,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Table as BTable, Dropdown } from "react-bootstrap";
import { useSearchParams } from "react-router";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import AppIconButton from "../shared/AppIconButton";
import Button from "../shared/Button";
import Icon from "../shared/Icon";
import Stack from "../shared/Stack";
import type { AppTableProps } from "./app-table-types";
import CopyAction from "./components/CopyAction";
import TableExport from "./components/TableExport";
import TableSkeleton from "./components/TableSkeleton";
import { TableProvider } from "./TableContext";
import { boxShadowLevels } from "./table.helper";
export default function AppTable<T = Record<string, unknown>>({
	showExport = true,
	otherActions,
	onAdd = null,
	enableActions = false,
	skeletonRows = 15,
	refetchData = (): void => {},
	defaultPageSize = 15,
	size = "md",
	tableName = "App Table",
	elevation = null,
	columns = [],
	data = [],
	rowActions,
	isLoading = false,
	enableClickToCopy = false,
	columnVisibility: externalColumnVisibility,
}: AppTableProps<T>): JSX.Element {
	const { isMobile } = useMediaQuery();

	const [searchParams, setSearchParams] = useSearchParams({
		page: "1",
		q: "",
	});

	const initialPageIndex = Math.max(
		0,
		(Number(searchParams.get("page")) || 1) - 1,
	);

	const [pagination, setPagination] = useState({
		pageIndex: initialPageIndex,
		pageSize: defaultPageSize,
	});

	const [columnPinning, setColumnPinning] = useState<{
		left?: string[];
		right?: string[];
	}>({
		right: ["actions"],
	});

	// Inicializar visibilidad de columnas - ocultar las marcadas como hiddenInTable
	const initialColumnVisibility = useMemo(() => {
		// Si se proporciona visibilidad externa, usarla
		if (externalColumnVisibility) {
			return externalColumnVisibility;
		}
		// Si no, usar la lógica basada en meta.hiddenInTable
		const visibility: Record<string, boolean> = {};
		columns.forEach((col: any) => {
			if (col.meta?.hiddenInTable) {
				visibility[col.accessorKey || col.id] = false;
			}
		});
		return visibility;
	}, [columns, externalColumnVisibility]);

	const [columnVisibility, setColumnVisibility] = useState(
		initialColumnVisibility,
	);

	const [copiedCellId, setCopiedCellId] = useState<string | null>(null);

	const [globalFilter, setGlobalFilter] = useState(searchParams.get("q") || "");

	const hasInitialized = useRef(false);

	useEffect(() => {
		if (!isLoading && data.length > 0 && !hasInitialized.current) {
			hasInitialized.current = true;
			const pageFromUrl = Math.max(
				0,
				(Number(searchParams.get("page")) || 1) - 1,
			);
			setPagination((prev) => ({
				...prev,
				pageIndex: pageFromUrl,
			}));
		}
	}, [isLoading, data.length]);

	useEffect(() => {
		if (hasInitialized.current) {
			const pageFromUrl = Math.max(
				0,
				(Number(searchParams.get("page")) || 1) - 1,
			);
			const qFromUrl = searchParams.get("q") || "";

			setPagination((prev) => ({
				...prev,
				pageIndex: pageFromUrl,
			}));

			if (qFromUrl !== globalFilter) {
				setGlobalFilter(qFromUrl);
			}
		}
	}, [rowActions]);

	useEffect(() => {
		if (
			hasInitialized.current &&
			globalFilter !== (searchParams.get("q") || "")
		) {
			const timer = setTimeout(() => {
				setSearchParams((prev) => ({
					...Object.fromEntries(prev),
					q: globalFilter,
				}));
			}, 300);

			return (): void => clearTimeout(timer);
		}
	}, []);

	const actionsColumn = useMemo(
		() => ({
			id: "actions",
			header: "Acciones",
			cell: ({ row }: CellContext<T, unknown>) => {
				const actions =
					typeof rowActions === "function" ? rowActions(row) : rowActions;
				return <div className="px-1 d-flex gap-2 mx-auto">{actions}</div>;
			},
			enableResizing: false,
			enablePinning: false,
		}),
		[],
	);

	const allColumns = useMemo(
		() => (enableActions ? [...columns, actionsColumn] : columns),
		[columns, actionsColumn, enableActions],
	);

	const table = useReactTable({
		enableColumnResizing: true,
		data,
		columns: allColumns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			pagination,
			columnPinning,
			columnVisibility,
			globalFilter,
		},
		meta: {
			refetchData,
			isLoading,
			tableName,
			enableClickToCopy,
		},
		onPaginationChange: setPagination,
		onGlobalFilterChange: setGlobalFilter,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnPinningChange: setColumnPinning,
	});

	const boxShadow = elevation ? boxShadowLevels[elevation] : undefined;

	const onUrlState = (page: number): void => {
		const currentQ = searchParams.get("q") || "";
		setSearchParams({
			page: (page + 1).toString(),
			...(currentQ && { q: currentQ }),
		});
	};

	return (
		<TableProvider
			columnVisibility={columnVisibility}
			setColumnVisibility={setColumnVisibility}
			table={table}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					minHeight: "85vh",
				}}
			>
				<style>{`
				@media (min-width: 1400px) {
					.app-table-container .table-scroll-container {
						max-height: calc(100vh - 300px) !important;
					}
				}
			`}</style>

				<Stack
					className=" justify-content-between"
					direction={isMobile ? "column" : "row"}
					spacing={2}
				>
					<p className="fw-bold h3">{tableName}</p>

					<div className="d-flex justify-content-between">
						<Stack direction="row" spacing={3}>
							<Dropdown id="dropdown-columns">
								<Dropdown.Toggle
									active={true}
									id="dropdown-basic"
									variant="secondary"
								>
									Columnas
								</Dropdown.Toggle>

								<Dropdown.Menu
									style={{
										marginTop: "8px",
										maxHeight: "300px",
										overflowY: "auto",
										overflowX: "hidden",
										padding: "12px",
									}}
									className="p-2 shadow"
								>
									{table
										.getAllColumns()
										.filter((column) => column.id !== "actions")
										.map((column) => (
											<div className="form-check" key={column.id}>
												<label className="form-check-label">
													<input
														checked={column.getIsVisible()}
														className="form-check-input"
														disabled={!column.getCanHide()}
														onChange={column.getToggleVisibilityHandler()}
														type="checkbox"
													/>
													{typeof column.columnDef.header === "string"
														? column.columnDef.header
														: "Column"}
												</label>
											</div>
										))}
								</Dropdown.Menu>
							</Dropdown>

							{showExport ? <TableExport table={table} /> : <></>}

							<AppIconButton
								disabled={isLoading}
								icon={
									<Icon
										ariaLabel="reload"
										className={`${isLoading ? "spin" : ""}`}
										name="arrow-repeat"
									/>
								}
								onClick={refetchData}
								variant="outline-secondary"
							/>
						</Stack>

						{onAdd && (
							<div className="ms-2">
								<Button
									icon={<i className="bi bi-plus me-2" />}
									onClick={onAdd}
									type="button"
									variant="primary"
								>
									Agregar
								</Button>
							</div>
						)}
					</div>
				</Stack>

				{otherActions && otherActions}

				<div
					className="app-table-container mt-3 border border-secondary-subtle"
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						minHeight: 0,
						borderRadius: "12px",
						overflow: "hidden",
						boxShadow,
					}}
				>
					<div
						className="table-scroll-container"
						style={{
							width: "100%",
							flex: 1,
							minHeight: 0,
							overflowY: "auto",
							overflowX: "auto",
						}}
					>
						<BTable
							className="table-bordered mb-0 table-auto"
							hover={true}
							size={size}
							striped={true}
							style={{
								tableLayout: "auto",
							}}
						>
							<thead
								style={{
									position: "sticky",
									top: 0,
									zIndex: 11,
									boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
								}}
							>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											const isPinned = header.column.getIsPinned();
											return (
												<th
													colSpan={header.colSpan}
													key={header.id}
													style={{
														width: header.getSize(),
														minWidth: header.column.columnDef.minSize,
														maxWidth: header.column.columnDef.maxSize,

														paddingTop: "12px",
														paddingBottom: "12px",
														position: isPinned ? "sticky" : "static",
													}}
												>
													{header.isPlaceholder
														? null
														: flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
												</th>
											);
										})}
									</tr>
								))}
							</thead>
							<tbody
								style={{
									flexGrow: 1,
								}}
							>
								{isLoading ? (
									<TableSkeleton
										skeletonRows={skeletonRows}
										tableColumns={table.getVisibleLeafColumns().map((col) => ({
											id: col.id,
											header:
												typeof col.columnDef.header === "string"
													? col.columnDef.header
													: col.id,
										}))}
									/>
								) : (
									table.getRowModel().rows.map((row) => (
										<tr key={row.id}>
											{row.getVisibleCells().map((cell) => {
												const isPinned = cell.column.getIsPinned();
												const isActionsColumn = cell.column.id === "actions";

												return (
													<td
														className={`actions-cell ${isPinned ? "shadow" : ""}`}
														key={cell.id}
														style={{
															...(isActionsColumn
																? {
																		whiteSpace: "nowrap",
																	}
																: {
																		width: cell.column.getSize(),
																		minWidth: cell.column.columnDef.minSize,
																		maxWidth: cell.column.columnDef.maxSize,
																	}),
															textAlign: isActionsColumn ? "center" : "start",
															position: isPinned ? "sticky" : "static",
															right: isPinned === "right" ? 0 : undefined,
														}}
													>
														{cell.column.columnDef.meta?.enableClickToCopy &&
														cell.column.id !== "actions" ? (
															<CopyAction
																cell={cell}
																copiedCellId={copiedCellId}
																enableClickToCopy={true}
																setCopiedCellId={setCopiedCellId}
															/>
														) : (
															flexRender(
																cell.column.columnDef.cell,
																cell.getContext(),
															)
														)}
													</td>
												);
											})}
										</tr>
									))
								)}
							</tbody>
						</BTable>
					</div>

					<div
						className="px-2 px-md-3 py-2 border-top"
						style={{ flexShrink: 0 }}
					>
						<div className="d-flex flex-wrap align-items-center justify-content-between gap-2 gap-md-3">
							<div className="d-flex flex-wrap gap-1 gap-md-2">
								<div className="d-flex flex-wrap align-items-center gap-1">
									<AppIconButton
										disabled={!table.getCanPreviousPage()}
										icon={
											<Icon ariaLabel="last page" name="chevron-double-left" />
										}
										onClick={(): void => table.setPageIndex(0)}
										size="sm"
										type="button"
										variant="outline"
									/>

									<AppIconButton
										disabled={!table.getCanPreviousPage()}
										icon={<Icon ariaLabel="last page" name="chevron-left" />}
										onClick={(): void => {
											table.previousPage();
											onUrlState(table.getState().pagination.pageIndex - 1);
										}}
										size="sm"
										type="button"
										variant="outline"
									/>

									<AppIconButton
										disabled={!table.getCanNextPage()}
										icon={<Icon ariaLabel="last page" name="chevron-right" />}
										onClick={(): void => {
											table.nextPage();
											onUrlState(table.getState().pagination.pageIndex + 1);
										}}
										size="sm"
										type="button"
										variant="outline"
									/>

									<AppIconButton
										disabled={!table.getCanNextPage()}
										icon={
											<Icon ariaLabel="last page" name="chevron-double-right" />
										}
										onClick={(): void =>
											table.setPageIndex(table.getPageCount() - 1)
										}
										size="sm"
										type="button"
										variant="outline"
									/>

									<span className="ms-2">
										<small>
											{table.getState().pagination.pageIndex + 1} de{" "}
											{table.getPageCount().toLocaleString()}
										</small>
									</span>
								</div>

								<div className="d-flex flex-wrap align-items-center gap-2">
									<label className="form-label m-0" htmlFor="goToPage">
										Ir a página:
									</label>
									<input
										className="form-control form-control-sm"
										id="goToPage"
										max={table.getPageCount()}
										min="1"
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>,
										): void => {
											const page = e.target.value
												? Number(e.target.value) - 1
												: 0;
											table.setPageIndex(page);
											onUrlState(page);
										}}
										style={{ width: "50px", minWidth: "50px" }}
										type="number"
										value={table.getState().pagination.pageIndex + 1}
									/>
								</div>
							</div>

							<div className="d-flex flex-wrap align-items-center gap-2">
								<label className="form-label m-0" htmlFor="pageSize">
									Mostrar:
								</label>
								<select
									className="form-select form-select-sm"
									id="pageSize"
									onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
										table.setPageSize(Number(e.target.value));
									}}
									style={{ width: "auto", minWidth: "60px" }}
									value={table.getState().pagination.pageSize}
								>
									{[5, 10, 15, 20, 30, 40, 50].map((pageSize) => (
										<option key={pageSize} value={pageSize}>
											{pageSize}
										</option>
									))}
								</select>
								<span
									className="ms-1 text-muted"
									style={{ whiteSpace: "nowrap", fontSize: "0.875rem" }}
								>
									de {table.getRowCount().toLocaleString()} registros
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</TableProvider>
	);
}
