async function fetchImageAsDataUrl(src: string): Promise<string> {
	try {
		const resp = await fetch(src)
		const blob = await resp.blob()
		return await new Promise<string>((resolve) => {
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result as string)
			reader.onerror = () => resolve('')
			reader.readAsDataURL(blob)
		})
	} catch {
		return ''
	}
}

async function preprocessImages(html: string): Promise<string> {
	const container = document.createElement('div')
	container.innerHTML = html

	const imgs = container.querySelectorAll('img')
	const tasks: Promise<void>[] = []

	for (const img of Array.from(imgs)) {
		const src = img.getAttribute('src')
		if (!src || src.startsWith('data:')) continue
		tasks.push(
			fetchImageAsDataUrl(src).then((dataUrl) => {
				if (dataUrl) img.setAttribute('src', dataUrl)
			}),
		)
	}

	await Promise.all(tasks)
	return container.innerHTML
}

export async function exportToWord(html: string, filename = 'documento') {
	const processedHtml = await preprocessImages(html)

	const fullHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Documento</title>
<style>
  body { font-family: 'Calibri', sans-serif; font-size: 11pt; line-height: 1.5; color: #333; }
  p { margin: 0 0 8pt 0; }
  h1 { font-size: 20pt; margin: 12pt 0 6pt 0; color: #1a1a1a; }
  h2 { font-size: 16pt; margin: 10pt 0 5pt 0; color: #1a1a1a; }
  h3 { font-size: 13pt; margin: 8pt 0 4pt 0; color: #1a1a1a; }
  h4 { font-size: 12pt; margin: 6pt 0 3pt 0; }
  table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
  th, td { border: 1px solid #999; padding: 4px 8px; text-align: left; }
  th { background: #f0f0f0; font-weight: bold; }
  blockquote { margin: 0 0 0 24pt; border-left: 3pt solid #ccc; padding-left: 10pt; color: #666; font-style: italic; }
  pre { font-family: 'Courier New', monospace; font-size: 9pt; background: #f5f5f5; padding: 8pt; white-space: pre-wrap; border: 1px solid #ddd; }
  code { font-family: 'Courier New', monospace; font-size: 10pt; background: #f5f5f5; padding: 1pt 3pt; }
  ul, ol { margin: 0 0 8pt 18pt; padding-left: 12pt; }
  li { margin-bottom: 2pt; }
  img { max-width: 100%; height: auto; }
  hr { border: none; border-top: 1px solid #ccc; margin: 12pt 0; }
</style>
</head>
<body>
${processedHtml}
</body>
</html>`

	const blob = new Blob([fullHtml], { type: 'application/msword' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = `${filename}.doc`
	a.click()
	URL.revokeObjectURL(url)
}
