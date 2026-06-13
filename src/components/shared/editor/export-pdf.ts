import html2pdf from 'html2pdf.js'

export async function exportToPdf(html: string, filename = 'documento') {
	const container = document.createElement('div')
	container.innerHTML = html

	const styles = document.createElement('style')
	styles.textContent = `
		body { font-family: 'Geist Variable', Inter, system-ui, sans-serif; color: #212529; line-height: 1.6; }
		h1 { font-size: 2em; font-weight: 700; margin: 0.67em 0; }
		h2 { font-size: 1.5em; font-weight: 600; margin: 0.83em 0; }
		h3 { font-size: 1.17em; font-weight: 600; margin: 1em 0; }
		p { margin: 0 0 0.5em 0; }
		ul, ol { padding-left: 1.5em; margin-bottom: 0.5em; }
		li { margin-bottom: 0.25em; }
		blockquote { padding-left: 1em; border-left: 3px solid #0d6efd; color: #6c757d; margin: 1em 0; }
		pre { background: #f8f9fa; border-radius: 4px; padding: 12px 16px; font-family: monospace; font-size: 0.9em; overflow-x: auto; }
		code { background: #f8f9fa; border-radius: 3px; padding: 2px 4px; font-family: monospace; font-size: 0.9em; }
		pre code { background: transparent; padding: 0; }
		hr { border: none; border-top: 1px solid #dee2e6; margin: 1em 0; }
		table { border-collapse: collapse; width: 100%; margin: 1em 0; }
		td, th { border: 1px solid #dee2e6; padding: 8px 12px; }
		th { background: #f8f9fa; font-weight: 600; }
		img { max-width: 100%; height: auto; }
		a { color: #0d6efd; }
	`

	container.prepend(styles)

	const opt = {
		margin: [15, 15, 15, 15] as [number, number, number, number],
		filename: `${filename}.pdf`,
		image: { type: 'jpeg' as const, quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
	}

	await html2pdf().set(opt).from(container).save()
}
