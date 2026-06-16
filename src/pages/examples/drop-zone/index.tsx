import { CheckCircle, File, Image, Upload } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Container } from 'react-bootstrap'
import BaseTabs from '@/components/shared/base-tabs'
import Dropzone from '@/components/shared/dropzone'
import { thumbnailGrid } from '@/components/shared/dropzone/dropzone.css'
import FilePreview from '@/components/shared/dropzone/file-preview'

export default function DropzoneExamplePage() {
	const [singleFile, setSingleFile] = useState<File | null>(null)
	const [multipleFiles, setMultipleFiles] = useState<File[]>([])
	const [imageFiles, setImageFiles] = useState<File[]>([])
	const [progressFiles, setProgressFiles] = useState<File[]>([])

	const handleSingleDrop = useCallback((accepted: File[]) => {
		setSingleFile(accepted[0] ?? null)
	}, [])

	const handleMultipleDrop = useCallback((accepted: File[]) => {
		setMultipleFiles((prev) => [...prev, ...accepted])
	}, [])

	const handleImageDrop = useCallback((accepted: File[]) => {
		setImageFiles((prev) => [...prev, ...accepted])
	}, [])

	const handleProgressDrop = useCallback((accepted: File[]) => {
		setProgressFiles((prev) => [...prev, ...accepted])
	}, [])

	const removeSingle = useCallback(() => setSingleFile(null), [])
	const removeMultiple = useCallback(
		(file: File) => setMultipleFiles((prev) => prev.filter((f) => f !== file)),
		[],
	)
	const removeImage = useCallback(
		(file: File) => setImageFiles((prev) => prev.filter((f) => f !== file)),
		[],
	)
	const removeProgress = useCallback(
		(file: File) => setProgressFiles((prev) => prev.filter((f) => f !== file)),
		[],
	)

	return (
		<Container fluid className='py-4'>
			<h4 className='mb-4'>Dropzone Examples</h4>

			<BaseTabs
				tabs={[
					{
						label: 'Single File',
						key: 'single',
						icon: <File size={16} />,
						content: (
							<div className='d-flex flex-column gap-3'>
								<Dropzone multiple={false} onDrop={handleSingleDrop} />
								{singleFile && (
									<FilePreview file={singleFile} onRemove={removeSingle} />
								)}
							</div>
						),
					},
					{
						label: 'Multiple Files',
						key: 'multiple',
						icon: <Upload size={16} />,
						content: (
							<div className='d-flex flex-column gap-3'>
								<Dropzone multiple onDrop={handleMultipleDrop} maxFiles={5} />
								{multipleFiles.length > 0 && (
									<div className='d-flex flex-column gap-2'>
										{multipleFiles.map((file, i) => (
											<FilePreview
												key={`${file.name}-${i}`}
												file={file}
												onRemove={removeMultiple}
											/>
										))}
									</div>
								)}
							</div>
						),
					},
					{
						label: 'Image Gallery',
						key: 'images',
						icon: <Image size={16} />,
						content: (
							<div className='d-flex flex-column gap-3'>
								<Dropzone
									multiple
									onDrop={handleImageDrop}
									accept={{
										'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
									}}
									maxFiles={8}
								/>
								{imageFiles.length > 0 && (
									<div className={thumbnailGrid}>
										{imageFiles.map((file, i) => (
											<FilePreview
												key={`${file.name}-${i}`}
												file={file}
												onRemove={removeImage}
												variant='grid'
											/>
										))}
									</div>
								)}
							</div>
						),
					},
					{
						label: 'With Progress',
						key: 'progress',
						icon: <CheckCircle size={16} />,
						content: (
							<div className='d-flex flex-column gap-3'>
								<Dropzone multiple onDrop={handleProgressDrop} maxFiles={5} />
								{progressFiles.length > 0 && (
									<div className='d-flex flex-column gap-2'>
										{progressFiles.map((file, i) => (
											<FilePreview
												key={`${file.name}-${i}`}
												file={file}
												onRemove={removeProgress}
												showProgress
											/>
										))}
									</div>
								)}
							</div>
						),
					},
				]}
			/>
		</Container>
	)
}
