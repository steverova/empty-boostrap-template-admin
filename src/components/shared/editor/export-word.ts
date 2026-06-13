import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

type ExportNode = {
	type: string
	content?: ExportNode[]
	attrs?: Record<string, any>
	marks?: { type: string; attrs?: Record<string, any> }[]
	text?: string
}

function getAlignment(align?: string): (typeof AlignmentType)[keyof typeof AlignmentType] {
	switch (align) {
		case 'center':
			return AlignmentType.CENTER
		case 'right':
			return AlignmentType.RIGHT
		case 'justify':
			return AlignmentType.JUSTIFIED
		default:
			return AlignmentType.LEFT
	}
}

function getHeadingLevel(level?: number): (typeof HeadingLevel)[keyof typeof HeadingLevel] {
	switch (level) {
		case 1:
			return HeadingLevel.HEADING_1
		case 2:
			return HeadingLevel.HEADING_2
		case 3:
			return HeadingLevel.HEADING_3
		default:
			return HeadingLevel.HEADING_1
	}
}

function parseInlineText(marks?: { type: string; attrs?: Record<string, any> }[]): {
	bold?: boolean
	italics?: boolean
	underline?: { type: 'single' | 'double' | 'thick' | 'dotted' | 'dottedHeavy' | 'dash' | 'dashedHeavy' | 'dashLong' | 'dashLongHeavy' | 'dotDash' | 'dashDotHeavy' | 'dotDotDash' | 'wave' | 'wavyHeavy' | 'wavyDouble' | 'none' }
	strike?: boolean
	font?: string
	color?: string
} {
	const result: ReturnType<typeof parseInlineText> = {}
	if (!marks) return result

	for (const mark of marks) {
		switch (mark.type) {
			case 'bold':
				result.bold = true
				break
			case 'italic':
				result.italics = true
				break
			case 'underline':
				result.underline = { type: 'single' }
				break
			case 'strike':
				result.strike = true
				break
			case 'code':
				result.font = 'Courier New'
				break
			case 'textStyle':
				if (mark.attrs?.color) {
					result.color = mark.attrs.color
				}
				break
		}
	}
	return result
}

function inlineRuns(node: ExportNode): TextRun[] {
	if (node.type === 'text') {
		const marks = parseInlineText(node.marks)
		return [
			new TextRun({
				text: node.text ?? '',
				...marks,
			}),
		]
	}

	if (node.content) {
		return node.content.flatMap((child) => inlineRuns(child))
	}

	return []
}

function nodeToDocx(node: ExportNode): Paragraph[] {
	const paragraphs: Paragraph[] = []

	if (node.type === 'text') {
		const runs = inlineRuns(node)
		paragraphs.push(
			new Paragraph({
				children: runs,
			}),
		)
		return paragraphs
	}

	if (node.type === 'heading') {
		const runs = node.content
			?.flatMap((child) => inlineRuns(child))
			?? []
		paragraphs.push(
			new Paragraph({
				heading: getHeadingLevel(node.attrs?.level),
				alignment: getAlignment(node.attrs?.textAlign),
				children: runs.length > 0 ? runs : [new TextRun({ text: '' })],
			}),
		)
		return paragraphs
	}

	if (node.type === 'paragraph') {
		const runs = node.content
			?.flatMap((child) => inlineRuns(child))
			?? []
		const align = getAlignment(node.attrs?.textAlign)
		paragraphs.push(
			new Paragraph({
				alignment: align,
				children: runs.length > 0 ? runs : [new TextRun({ text: '' })],
			}),
		)
		return paragraphs
	}

	if (node.type === 'bulletList') {
		node.content?.forEach((item) => {
			const itemParagraphs = nodeToDocx(item)
			itemParagraphs.forEach((p) => {
				paragraphs.push(p)
			})
		})
		return paragraphs
	}

	if (node.type === 'listItem') {
		const runs = node.content
			?.filter((c) => c.type === 'paragraph')
			.flatMap((child) => child.content?.flatMap((c) => inlineRuns(c)) ?? [])
			?? []
		paragraphs.push(
			new Paragraph({
				bullet: { level: 0 },
				children: runs.length > 0 ? runs : [new TextRun({ text: '' })],
			}),
		)
		return paragraphs
	}

	if (node.type === 'blockquote') {
		node.content?.forEach((child) => {
			const childParagraphs = nodeToDocx(child)
			childParagraphs.forEach(() => {
				paragraphs.push(
					new Paragraph({
						indent: { left: 720 },
						children: [
							new TextRun({
								text: '',
								italics: true,
								color: '666666',
							}),
						],
					}),
				)
			})
		})
		return paragraphs
	}

	if (node.type === 'codeBlock') {
		const codeText = node.content?.map((c) => c.text ?? '').join('\n') ?? ''
		paragraphs.push(
			new Paragraph({
				children: [
					new TextRun({
						text: codeText,
						font: 'Courier New',
						size: 20,
					}),
				],
			}),
		)
		return paragraphs
	}

	if (node.type === 'horizontalRule') {
		paragraphs.push(
			new Paragraph({
				thematicBreak: true,
				children: [],
			}),
		)
		return paragraphs
	}

	if (node.type === 'taskList') {
		node.content?.forEach((item) => {
			const checked = item.attrs?.checked ?? false
			const runs = item.content
				?.filter((c) => c.type === 'paragraph')
				.flatMap((child) => child.content?.flatMap((c) => inlineRuns(c)) ?? [])
				?? []
			paragraphs.push(
				new Paragraph({
					bullet: { level: 0 },
					children: [
						new TextRun({
							text: checked ? '☑ ' : '☐ ',
						}),
						...runs,
					],
				}),
			)
		})
		return paragraphs
	}

	if (node.content) {
		node.content.forEach((child) => {
			paragraphs.push(...nodeToDocx(child))
		})
	}

	return paragraphs
}

export async function exportToWord(html: string, filename = 'documento') {
	const tiptapNode = htmlToJson(html)

	const doc = new Document({
		sections: [
			{
				children: nodeToDocx(tiptapNode),
			},
		],
	})

	const blob = await Packer.toBlob(doc)
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = `${filename}.docx`
	a.click()
	URL.revokeObjectURL(url)
}

function htmlToJson(html: string): ExportNode {
	const tempDiv = document.createElement('div')
	tempDiv.innerHTML = html
	const children = Array.from(tempDiv.childNodes)
	return {
		type: 'doc',
		content: children.flatMap((child) => elementToNode(child)),
	}
}

function elementToNode(el: ChildNode): ExportNode[] {
	if (el.nodeType === Node.TEXT_NODE) {
		const text = el.textContent ?? ''
		if (!text.trim()) return []
		return [{ type: 'text', text }]
	}

	if (el.nodeType !== Node.ELEMENT_NODE) return []

	const element = el as HTMLElement
	const tag = element.tagName.toLowerCase()

	const marks: { type: string; attrs?: Record<string, any> }[] = []
	if (tag === 'strong' || tag === 'b') marks.push({ type: 'bold' })
	if (tag === 'em' || tag === 'i') marks.push({ type: 'italic' })
	if (tag === 'u') marks.push({ type: 'underline' })
	if (tag === 's' || tag === 'del') marks.push({ type: 'strike' })
	if (tag === 'code') marks.push({ type: 'code' })
	if (tag === 'a') marks.push({ type: 'link', attrs: { href: element.getAttribute('href') } })

	const inlineContent = Array.from(element.childNodes).flatMap((child) => {
		const childNodes = elementToNode(child)
		if (marks.length > 0) {
			return childNodes.map((n) => ({
				...n,
				marks: [...(n.marks ?? []), ...marks],
			}))
		}
		return childNodes
	})

	const blockMap: Record<string, string> = {
		p: 'paragraph',
		h1: 'heading',
		h2: 'heading',
		h3: 'heading',
		h4: 'heading',
		h5: 'heading',
		h6: 'heading',
		ul: 'bulletList',
		ol: 'orderedList',
		li: 'listItem',
		blockquote: 'blockquote',
		pre: 'codeBlock',
		hr: 'horizontalRule',
	}

	const blockType = blockMap[tag]

	if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
		const level = Number.parseInt(tag[1])
		return [
			{
				type: 'heading',
				attrs: { level },
				content: inlineContent,
			},
		]
	}

	if (blockType) {
		if (blockType === 'bulletList' || blockType === 'orderedList') {
			const listItems = Array.from(element.children).map((li) => ({
				type: 'listItem' as const,
				content: elementToNode(li),
			}))
			return [{ type: blockType, content: listItems }]
		}

		if (blockType === 'codeBlock') {
			return [
				{
					type: 'codeBlock',
					content: [{ type: 'text', text: element.textContent ?? '' }],
				},
			]
		}

		if (blockType === 'horizontalRule') {
			return [{ type: 'horizontalRule' }]
		}

		return [
			{
				type: blockType,
				content: inlineContent,
			},
		]
	}

	if (tag === 'div' && element.getAttribute('data-youtube')) {
		return [{ type: 'paragraph', content: [{ type: 'text', text: '[YouTube Video]' }] }]
	}

	if (tag === 'img') {
		return [{ type: 'paragraph', content: [{ type: 'text', text: `[Imagen: ${element.getAttribute('alt') ?? ''}]` }] }]
	}

	if (tag === 'br') {
		return [{ type: 'paragraph', content: [] }]
	}

	return inlineContent
}
