import { FolderOpen, Inbox, Plus, RefreshCw, Search, Trash2 } from 'lucide-react'
import { Card } from 'react-bootstrap'
import EmptyState from '@/components/shared/empty-state'

export function Component() {
	return (
		<div className='container py-4'>
			<h4 className='mb-4'>Empty State</h4>

			<div className='d-flex flex-column gap-4' style={{ maxWidth: 560 }}>
				<div>
					<h6>Básico (icono por defecto)</h6>
					<Card>
						<Card.Body>
							<EmptyState title='Sin resultados' />
						</Card.Body>
					</Card>
				</div>

				<div>
					<h6>Con descripción</h6>
					<Card>
						<Card.Body>
							<EmptyState
								icon={Inbox}
								title='Tu bandeja está vacía'
								description='Cuando recibas mensajes, aparecerán aquí.'
							/>
						</Card.Body>
					</Card>
				</div>

				<div>
					<h6>Con acción principal</h6>
					<Card>
						<Card.Body>
							<EmptyState
								icon={FolderOpen}
								title='No hay archivos'
								description='Sube tu primer archivo para comenzar.'
								action={{
									label: 'Subir archivo',
									onClick: () => alert('Subir archivo'),
								}}
							/>
						</Card.Body>
					</Card>
				</div>

				<div>
					<h6>Con acción + secundaria</h6>
					<Card>
						<Card.Body>
							<EmptyState
								icon={Search}
								title='Sin coincidencias'
								description='Intenta con otros términos de búsqueda.'
								action={{
									label: 'Buscar',
									onClick: () => alert('Buscar'),
									icon: Search,
								}}
								secondaryAction={{
									label: 'Limpiar filtros',
									onClick: () => alert('Limpiar'),
								}}
							/>
						</Card.Body>
					</Card>
				</div>

				<div>
					<h6>Acción peligrosa (borrar)</h6>
					<Card>
						<Card.Body>
							<EmptyState
								icon={Trash2}
								title='Todo eliminado'
								description='No queda nada en esta sección.'
								action={{
									label: 'Crear nuevo',
									onClick: () => alert('Crear'),
									icon: Plus,
									variant: 'danger',
								}}
							/>
						</Card.Body>
					</Card>
				</div>

				<div>
					<h6>Con botón recargar</h6>
					<Card>
						<Card.Body>
							<EmptyState
								icon={RefreshCw}
								title='Algo salió mal'
								description='No se pudieron cargar los datos.'
								action={{
									label: 'Reintentar',
									onClick: () => alert('Reintentar'),
									icon: RefreshCw,
								}}
							/>
						</Card.Body>
					</Card>
				</div>

				<div>
					<h6>Contenido personalizado debajo</h6>
					<Card>
						<Card.Body>
							<EmptyState
								title='Personaliza este espacio'
								description='Agrega contenido extra como children.'
							>
								<div className='mt-3 p-3 border rounded text-muted small'>
									Contenido personalizado via <code>children</code>
								</div>
							</EmptyState>
						</Card.Body>
					</Card>
				</div>
			</div>
		</div>
	)
}
