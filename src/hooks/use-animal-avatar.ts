import { useMemo } from 'react'

type Animal =
	| 'cat'
	| 'dog'
	| 'bird'
	| 'fish'
	| 'rabbit'
	| 'bear'
	| 'fox'
	| 'lion'
	| 'owl'
	| 'butterfly'
	| 'panda'
	| 'frog'
	| 'turtle'
	| 'penguin'
	| 'octopus'
	| 'deer'
	| 'wolf'
	| 'monkey'
	| 'hedgehog'
	| 'elephant'

type ColorPalette = {
	bg: string
	primary: string
	secondary: string
	accent: string
}

const PALETTES: ColorPalette[] = [
	{ bg: '#FFF3E0', primary: '#FF9800', secondary: '#F57C00', accent: '#E65100' },
	{ bg: '#E8F5E9', primary: '#66BB6A', secondary: '#388E3C', accent: '#1B5E20' },
	{ bg: '#E3F2FD', primary: '#42A5F5', secondary: '#1E88E5', accent: '#0D47A1' },
	{ bg: '#FCE4EC', primary: '#EC407A', secondary: '#C2185B', accent: '#880E4F' },
	{ bg: '#F3E5F5', primary: '#AB47BC', secondary: '#7B1FA2', accent: '#4A148C' },
	{ bg: '#FFF8E1', primary: '#FFCA28', secondary: '#F9A825', accent: '#F57F17' },
	{ bg: '#E0F7FA', primary: '#26C6DA', secondary: '#00ACC1', accent: '#00838F' },
	{ bg: '#FBE9E7', primary: '#FF7043', secondary: '#E64A19', accent: '#BF360C' },
	{ bg: '#E8EAF6', primary: '#5C6BC0', secondary: '#3949AB', accent: '#1A237E' },
	{ bg: '#F1F8E9', primary: '#9CCC65', secondary: '#7CB342', accent: '#558B2F' },
	{ bg: '#FFFDE7', primary: '#FFEE58', secondary: '#FDD835', accent: '#F9A825' },
	{ bg: '#E0F2F1', primary: '#26A69A', secondary: '#00897B', accent: '#00695C' },
	{ bg: '#FCE4EC', primary: '#F48FB1', secondary: '#EC407A', accent: '#C2185B' },
	{ bg: '#E8F5E9', primary: '#81C784', secondary: '#4CAF50', accent: '#2E7D32' },
	{ bg: '#EDE7F6', primary: '#9575CD', secondary: '#7E57C2', accent: '#4527A0' },
]

const ANIMALS: Animal[] = [
	'cat', 'dog', 'bird', 'fish', 'rabbit',
	'bear', 'fox', 'lion', 'owl', 'butterfly',
	'panda', 'frog', 'turtle', 'penguin', 'octopus',
	'deer', 'wolf', 'monkey', 'hedgehog', 'elephant',
]

function hashCode(str: string): number {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i)
		hash = ((hash << 5) - hash + char) | 0
	}
	return Math.abs(hash)
}

function getAnimalSVG(animal: Animal, colors: ColorPalette): string {
	const { bg, primary, secondary, accent } = colors

	const svgByAnimal: Record<Animal, string> = {
		cat: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<polygon points="26,42 14,8 42,34" fill="${primary}"/>
				<polygon points="74,42 86,8 58,34" fill="${primary}"/>
				<polygon points="28,40 20,16 40,35" fill="${accent}"/>
				<polygon points="72,40 80,16 60,35" fill="${accent}"/>
				<circle cx="50" cy="55" r="30" fill="${primary}"/>
				<circle cx="38" cy="50" r="6" fill="white"/>
				<circle cx="62" cy="50" r="6" fill="white"/>
				<circle cx="39" cy="50" r="3" fill="${accent}"/>
				<circle cx="63" cy="50" r="3" fill="${accent}"/>
				<circle cx="40" cy="48" r="1.2" fill="white"/>
				<circle cx="64" cy="48" r="1.2" fill="white"/>
				<ellipse cx="50" cy="62" rx="3.5" ry="2.5" fill="${secondary}"/>
				<path d="M44,66 Q50,70 56,66" stroke="${secondary}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
				<line x1="22" y1="56" x2="36" y2="58" stroke="${secondary}" stroke-width="1" stroke-linecap="round"/>
				<line x1="22" y1="61" x2="36" y2="62" stroke="${secondary}" stroke-width="1" stroke-linecap="round"/>
				<line x1="78" y1="56" x2="64" y2="58" stroke="${secondary}" stroke-width="1" stroke-linecap="round"/>
				<line x1="78" y1="61" x2="64" y2="62" stroke="${secondary}" stroke-width="1" stroke-linecap="round"/>
			</svg>`,

		dog: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="50" cy="52" r="32" fill="${primary}"/>
				<ellipse cx="26" cy="40" rx="12" ry="18" fill="${secondary}" transform="rotate(-12 26 40)"/>
				<ellipse cx="74" cy="40" rx="12" ry="18" fill="${secondary}" transform="rotate(12 74 40)"/>
				<circle cx="38" cy="48" r="6" fill="white"/>
				<circle cx="62" cy="48" r="6" fill="white"/>
				<circle cx="39" cy="49" r="3" fill="${accent}"/>
				<circle cx="63" cy="49" r="3" fill="${accent}"/>
				<circle cx="40" cy="47" r="1" fill="white"/>
				<circle cx="64" cy="47" r="1" fill="white"/>
				<ellipse cx="50" cy="64" rx="6" ry="4" fill="${accent}"/>
				<circle cx="50" cy="63" r="1.5" fill="white" opacity="0.5"/>
				<path d="M44,68 Q50,72 56,68" stroke="${secondary}" stroke-width="1" fill="none" stroke-linecap="round"/>
				<ellipse cx="50" cy="76" rx="4" ry="5" fill="#E57373"/>
			</svg>`,

		bird: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="48" cy="52" r="28" fill="${primary}"/>
				<circle cx="42" cy="34" r="6" fill="${secondary}"/>
				<circle cx="42" cy="34" r="3" fill="${accent}"/>
				<circle cx="56" cy="46" r="5.5" fill="white"/>
				<circle cx="57" cy="46" r="2.8" fill="${accent}"/>
				<circle cx="58" cy="45" r="0.9" fill="white"/>
				<polygon points="68,50 86,47 68,56" fill="${secondary}"/>
				<ellipse cx="42" cy="60" rx="14" ry="10" fill="${secondary}" opacity="0.3"/>
				<path d="M38,70 Q36,74 34,72" stroke="${secondary}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
				<path d="M42,70 Q42,74 40,73" stroke="${secondary}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
			</svg>`,

		fish: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<ellipse cx="48" cy="50" rx="34" ry="24" fill="${primary}"/>
				<polygon points="82,50 96,36 96,64" fill="${secondary}"/>
				<polygon points="82,50 94,40 94,60" fill="${accent}" opacity="0.3"/>
				<circle cx="30" cy="46" r="5.5" fill="white"/>
				<circle cx="29" cy="46" r="2.8" fill="${accent}"/>
				<circle cx="30" cy="45" r="0.9" fill="white"/>
				<path d="M18,50 Q16,52 18,54" stroke="${accent}" stroke-width="1" fill="none" stroke-linecap="round"/>
				<path d="M36,40 Q50,34 64,40" stroke="${secondary}" stroke-width="1" fill="none" opacity="0.5"/>
				<path d="M34,50 Q50,58 66,50" stroke="${secondary}" stroke-width="1" fill="none" opacity="0.5"/>
				<path d="M36,60 Q50,66 64,60" stroke="${secondary}" stroke-width="1" fill="none" opacity="0.5"/>
				<ellipse cx="48" cy="42" rx="10" ry="6" fill="${secondary}" opacity="0.2"/>
			</svg>`,

		rabbit: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<ellipse cx="38" cy="22" rx="8" ry="22" fill="${primary}"/>
				<ellipse cx="62" cy="22" rx="8" ry="22" fill="${primary}"/>
				<ellipse cx="38" cy="22" rx="4" ry="14" fill="${secondary}"/>
				<ellipse cx="62" cy="22" rx="4" ry="14" fill="${secondary}"/>
				<circle cx="50" cy="58" r="28" fill="${primary}"/>
				<circle cx="40" cy="52" r="5" fill="${accent}"/>
				<circle cx="60" cy="52" r="5" fill="${accent}"/>
				<circle cx="41" cy="51" r="1.5" fill="white"/>
				<circle cx="61" cy="51" r="1.5" fill="white"/>
				<ellipse cx="50" cy="64" rx="3.5" ry="2.5" fill="${secondary}"/>
				<rect x="46" y="67" width="8" height="6" rx="2" fill="white"/>
				<line x1="30" y1="58" x2="20" y2="56" stroke="${secondary}" stroke-width="1" stroke-linecap="round"/>
				<line x1="30" y1="62" x2="20" y2="64" stroke="${secondary}" stroke-width="1" stroke-linecap="round"/>
				<line x1="70" y1="58" x2="80" y2="56" stroke="${secondary}" stroke-width="1" stroke-linecap="round"/>
				<line x1="70" y1="62" x2="80" y2="64" stroke="${secondary}" stroke-width="1" stroke-linecap="round"/>
			</svg>`,

		bear: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="30" cy="30" r="12" fill="${primary}"/>
				<circle cx="70" cy="30" r="12" fill="${primary}"/>
				<circle cx="30" cy="30" r="6" fill="${secondary}"/>
				<circle cx="70" cy="30" r="6" fill="${secondary}"/>
				<circle cx="50" cy="54" r="32" fill="${primary}"/>
				<circle cx="38" cy="48" r="5.5" fill="white"/>
				<circle cx="62" cy="48" r="5.5" fill="white"/>
				<circle cx="39" cy="48" r="2.8" fill="${accent}"/>
				<circle cx="63" cy="48" r="2.8" fill="${accent}"/>
				<circle cx="40" cy="47" r="0.9" fill="white"/>
				<circle cx="64" cy="47" r="0.9" fill="white"/>
				<ellipse cx="50" cy="60" rx="10" ry="7" fill="${secondary}" opacity="0.25"/>
				<ellipse cx="50" cy="60" rx="6" ry="4.5" fill="${accent}"/>
				<ellipse cx="50" cy="59" rx="2" ry="1" fill="white" opacity="0.5"/>
				<path d="M44,65 Q50,68 56,65" stroke="${accent}" stroke-width="1" fill="none" stroke-linecap="round"/>
			</svg>`,

		fox: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<polygon points="28,42 14,8 44,36" fill="${primary}"/>
				<polygon points="72,42 86,8 56,36" fill="${primary}"/>
				<polygon points="30,40 22,18 42,37" fill="white"/>
				<polygon points="70,40 78,18 58,37" fill="white"/>
				<circle cx="50" cy="56" r="28" fill="${primary}"/>
				<polygon points="50,54 38,72 62,72" fill="white"/>
				<circle cx="38" cy="50" r="5" fill="white"/>
				<circle cx="62" cy="50" r="5" fill="white"/>
				<ellipse cx="38" cy="50" rx="2.5" ry="2.8" fill="${accent}"/>
				<ellipse cx="62" cy="50" rx="2.5" ry="2.8" fill="${accent}"/>
				<circle cx="50" cy="62" r="3" fill="${accent}"/>
				<path d="M46,57 Q50,55 54,57" stroke="${accent}" stroke-width="0.8" fill="none"/>
			</svg>`,

		lion: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="50" cy="50" r="40" fill="${secondary}"/>
				<circle cx="50" cy="36" r="8" fill="${secondary}"/>
				<circle cx="36" cy="40" r="7" fill="${secondary}"/>
				<circle cx="64" cy="40" r="7" fill="${secondary}"/>
				<circle cx="36" cy="54" r="7" fill="${secondary}"/>
				<circle cx="64" cy="54" r="7" fill="${secondary}"/>
				<circle cx="44" cy="60" r="6" fill="${secondary}"/>
				<circle cx="56" cy="60" r="6" fill="${secondary}"/>
				<circle cx="50" cy="54" r="26" fill="${primary}"/>
				<circle cx="40" cy="48" r="4.5" fill="white"/>
				<circle cx="60" cy="48" r="4.5" fill="white"/>
				<circle cx="41" cy="48" r="2.2" fill="${accent}"/>
				<circle cx="61" cy="48" r="2.2" fill="${accent}"/>
				<circle cx="42" cy="47" r="0.8" fill="white"/>
				<circle cx="62" cy="47" r="0.8" fill="white"/>
				<ellipse cx="50" cy="59" rx="5" ry="3.5" fill="${accent}"/>
				<ellipse cx="50" cy="58" rx="1.5" ry="1" fill="white" opacity="0.4"/>
				<path d="M45,64 Q50,67 55,64" stroke="${accent}" stroke-width="1" fill="none" stroke-linecap="round"/>
			</svg>`,

		owl: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="50" cy="52" r="32" fill="${primary}"/>
				<polygon points="30,34 22,10 42,28" fill="${secondary}"/>
				<polygon points="70,34 78,10 58,28" fill="${secondary}"/>
				<circle cx="38" cy="46" r="12" fill="white"/>
				<circle cx="62" cy="46" r="12" fill="white"/>
				<circle cx="38" cy="46" r="6" fill="${accent}"/>
				<circle cx="62" cy="46" r="6" fill="${accent}"/>
				<circle cx="38" cy="46" r="3" fill="black"/>
				<circle cx="62" cy="46" r="3" fill="black"/>
				<circle cx="40" cy="44" r="1.2" fill="white"/>
				<circle cx="64" cy="44" r="1.2" fill="white"/>
				<polygon points="50,56 45,66 55,66" fill="${secondary}"/>
				<path d="M32,64 Q50,74 68,64" stroke="${secondary}" stroke-width="1.2" fill="none"/>
			</svg>`,

		butterfly: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<ellipse cx="32" cy="42" rx="20" ry="28" fill="${primary}" opacity="0.85"/>
				<ellipse cx="68" cy="42" rx="20" ry="28" fill="${primary}" opacity="0.85"/>
				<ellipse cx="32" cy="72" rx="12" ry="14" fill="${secondary}" opacity="0.85"/>
				<ellipse cx="68" cy="72" rx="12" ry="14" fill="${secondary}" opacity="0.85"/>
				<ellipse cx="50" cy="54" rx="4" ry="22" fill="${accent}"/>
				<path d="M48,32 Q38,18 30,22" stroke="${accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
				<path d="M52,32 Q62,18 70,22" stroke="${accent}" stroke-width="2" fill="none" stroke-linecap="round"/>
				<circle cx="30" cy="22" r="3" fill="${accent}"/>
				<circle cx="70" cy="22" r="3" fill="${accent}"/>
				<circle cx="32" cy="38" r="5" fill="white" opacity="0.35"/>
				<circle cx="68" cy="38" r="5" fill="white" opacity="0.35"/>
				<circle cx="36" cy="42" r="2.5" fill="${accent}" opacity="0.25"/>
				<circle cx="64" cy="42" r="2.5" fill="${accent}" opacity="0.25"/>
			</svg>`,

		panda: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="50" cy="52" r="36" fill="white"/>
				<circle cx="32" cy="34" r="12" fill="${accent}"/>
				<circle cx="68" cy="34" r="12" fill="${accent}"/>
				<ellipse cx="38" cy="48" rx="8" ry="9" fill="${accent}" transform="rotate(-8 38 48)"/>
				<ellipse cx="62" cy="48" rx="8" ry="9" fill="${accent}" transform="rotate(8 62 48)"/>
				<circle cx="38" cy="46" r="4" fill="white"/>
				<circle cx="62" cy="46" r="4" fill="white"/>
				<circle cx="39" cy="46" r="2" fill="black"/>
				<circle cx="63" cy="46" r="2" fill="black"/>
				<circle cx="40" cy="45" r="0.7" fill="white"/>
				<circle cx="64" cy="45" r="0.7" fill="white"/>
				<ellipse cx="50" cy="60" rx="4" ry="2.5" fill="${accent}"/>
				<path d="M45,64 Q50,66 55,64" stroke="${accent}" stroke-width="1" fill="none" stroke-linecap="round"/>
			</svg>`,

		frog: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<ellipse cx="50" cy="58" rx="32" ry="24" fill="${primary}"/>
				<circle cx="34" cy="34" r="12" fill="${primary}"/>
				<circle cx="66" cy="34" r="12" fill="${primary}"/>
				<circle cx="34" cy="32" r="6.5" fill="white"/>
				<circle cx="66" cy="32" r="6.5" fill="white"/>
				<circle cx="34" cy="32" r="3.2" fill="${accent}"/>
				<circle cx="66" cy="32" r="3.2" fill="${accent}"/>
				<circle cx="35" cy="31" r="1" fill="white"/>
				<circle cx="67" cy="31" r="1" fill="white"/>
				<path d="M34,64 Q50,76 66,64" stroke="${secondary}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
				<circle cx="28" cy="56" r="4" fill="${secondary}" opacity="0.3"/>
				<circle cx="72" cy="56" r="4" fill="${secondary}" opacity="0.3"/>
			</svg>`,

		turtle: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="52" cy="52" r="28" fill="${secondary}"/>
				<ellipse cx="52" cy="50" rx="20" ry="16" fill="${primary}"/>
				<path d="M34,42 L52,34 L70,42" stroke="${accent}" stroke-width="1" fill="none"/>
				<path d="M34,50 L52,42 L70,50" stroke="${accent}" stroke-width="1" fill="none"/>
				<path d="M34,58 L52,50 L70,58" stroke="${accent}" stroke-width="1" fill="none"/>
				<circle cx="28" cy="48" r="8" fill="${primary}"/>
				<circle cx="26" cy="46" r="3" fill="white"/>
				<circle cx="26" cy="46" r="1.5" fill="${accent}"/>
				<circle cx="24" cy="45" r="0.6" fill="white"/>
				<ellipse cx="22" cy="50" rx="2.5" ry="1.5" fill="${secondary}" opacity="0.5"/>
			</svg>`,

		penguin: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="50" cy="52" r="32" fill="${accent}"/>
				<ellipse cx="50" cy="56" rx="20" ry="24" fill="white"/>
				<circle cx="40" cy="44" r="5" fill="white"/>
				<circle cx="60" cy="44" r="5" fill="white"/>
				<circle cx="41" cy="44" r="2.5" fill="black"/>
				<circle cx="61" cy="44" r="2.5" fill="black"/>
				<circle cx="42" cy="43" r="0.8" fill="white"/>
				<circle cx="62" cy="43" r="0.8" fill="white"/>
				<polygon points="50,52 44,60 56,60" fill="${secondary}"/>
				<ellipse cx="36" cy="64" rx="6" ry="5" fill="${secondary}" opacity="0.5"/>
				<ellipse cx="64" cy="64" rx="6" ry="5" fill="${secondary}" opacity="0.5"/>
			</svg>`,

		octopus: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<ellipse cx="50" cy="40" rx="30" ry="26" fill="${primary}"/>
				<path d="M26,56 Q20,74 28,80 Q26,70 30,58" fill="${secondary}"/>
				<path d="M36,60 Q34,78 40,84 Q38,74 40,62" fill="${secondary}"/>
				<path d="M46,62 Q46,80 50,86 Q48,74 48,62" fill="${secondary}"/>
				<path d="M56,60 Q58,78 52,84 Q54,74 54,62" fill="${secondary}"/>
				<path d="M66,56 Q72,74 64,80 Q66,70 62,58" fill="${secondary}"/>
				<circle cx="38" cy="38" r="6" fill="white"/>
				<circle cx="62" cy="38" r="6" fill="white"/>
				<circle cx="39" cy="38" r="3" fill="${accent}"/>
				<circle cx="63" cy="38" r="3" fill="${accent}"/>
				<circle cx="40" cy="37" r="1" fill="white"/>
				<circle cx="64" cy="37" r="1" fill="white"/>
				<ellipse cx="50" cy="50" rx="4" ry="2" fill="${secondary}"/>
			</svg>`,

		deer: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<ellipse cx="50" cy="58" rx="22" ry="28" fill="${primary}"/>
				<path d="M34,36 L28,12 L22,8 M28,12 L24,6" stroke="${secondary}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
				<path d="M66,36 L72,12 L78,8 M72,12 L76,6" stroke="${secondary}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
				<circle cx="40" cy="52" r="5" fill="white"/>
				<circle cx="60" cy="52" r="5" fill="white"/>
				<circle cx="41" cy="52" r="2.5" fill="${accent}"/>
				<circle cx="61" cy="52" r="2.5" fill="${accent}"/>
				<circle cx="42" cy="51" r="0.8" fill="white"/>
				<circle cx="62" cy="51" r="0.8" fill="white"/>
				<ellipse cx="50" cy="64" rx="3.5" ry="2.5" fill="${accent}"/>
				<circle cx="44" cy="58" r="3" fill="${secondary}" opacity="0.2"/>
				<circle cx="56" cy="58" r="3" fill="${secondary}" opacity="0.2"/>
			</svg>`,

		wolf: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="50" cy="54" r="30" fill="${primary}"/>
				<polygon points="28,42 14,8 44,34" fill="${primary}"/>
				<polygon points="72,42 86,8 56,34" fill="${primary}"/>
				<polygon points="30,40 20,16 42,35" fill="${secondary}"/>
				<polygon points="70,40 80,16 58,35" fill="${secondary}"/>
				<path d="M26,56 Q50,78 74,56" fill="white"/>
				<circle cx="38" cy="48" r="5" fill="white"/>
				<circle cx="62" cy="48" r="5" fill="white"/>
				<circle cx="39" cy="48" r="2.5" fill="${accent}"/>
				<circle cx="63" cy="48" r="2.5" fill="${accent}"/>
				<circle cx="40" cy="47" r="0.8" fill="white"/>
				<circle cx="64" cy="47" r="0.8" fill="white"/>
				<ellipse cx="50" cy="62" rx="4" ry="2.8" fill="${accent}"/>
				<path d="M44,44 Q48,42 50,44" stroke="${secondary}" stroke-width="1" fill="none" stroke-linecap="round"/>
				<path d="M50,44 Q52,42 56,44" stroke="${secondary}" stroke-width="1" fill="none" stroke-linecap="round"/>
			</svg>`,

		monkey: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="50" cy="50" r="30" fill="${primary}"/>
				<circle cx="26" cy="44" r="10" fill="${secondary}"/>
				<circle cx="74" cy="44" r="10" fill="${secondary}"/>
				<circle cx="26" cy="44" r="5.5" fill="${accent}" opacity="0.4"/>
				<circle cx="74" cy="44" r="5.5" fill="${accent}" opacity="0.4"/>
				<ellipse cx="50" cy="58" rx="16" ry="14" fill="${secondary}"/>
				<circle cx="42" cy="46" r="4.5" fill="white"/>
				<circle cx="58" cy="46" r="4.5" fill="white"/>
				<circle cx="43" cy="46" r="2.2" fill="${accent}"/>
				<circle cx="59" cy="46" r="2.2" fill="${accent}"/>
				<circle cx="44" cy="45" r="0.8" fill="white"/>
				<circle cx="60" cy="45" r="0.8" fill="white"/>
				<ellipse cx="50" cy="60" rx="2.8" ry="2" fill="${accent}"/>
				<path d="M44,66 Q50,69 56,66" stroke="${accent}" stroke-width="1" fill="none" stroke-linecap="round"/>
			</svg>`,

		hedgehog: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<ellipse cx="42" cy="58" rx="30" ry="22" fill="${secondary}"/>
				<path d="M20,48 L24,28 L32,46" fill="${primary}"/>
				<path d="M28,38 L34,18 L42,38" fill="${primary}"/>
				<path d="M38,32 L46,12 L54,34" fill="${primary}"/>
				<path d="M48,32 L56,14 L60,36" fill="${primary}"/>
				<path d="M56,36 L66,20 L64,42" fill="${primary}"/>
				<path d="M62,40 L74,26 L70,48" fill="${primary}"/>
				<ellipse cx="32" cy="56" rx="18" ry="14" fill="${secondary}"/>
				<circle cx="30" cy="52" r="4.5" fill="white"/>
				<circle cx="31" cy="52" r="2.2" fill="${accent}"/>
				<circle cx="32" cy="51" r="0.7" fill="white"/>
				<ellipse cx="24" cy="57" rx="3" ry="2" fill="${accent}"/>
				<circle cx="26" cy="60" r="1.2" fill="white" opacity="0.4"/>
			</svg>`,

		elephant: `
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<circle cx="50" cy="50" r="48" fill="${bg}"/>
				<circle cx="50" cy="50" r="34" fill="${primary}"/>
				<ellipse cx="22" cy="40" rx="12" ry="16" fill="${secondary}"/>
				<ellipse cx="78" cy="40" rx="12" ry="16" fill="${secondary}"/>
				<ellipse cx="22" cy="40" rx="7" ry="10" fill="${accent}" opacity="0.3"/>
				<ellipse cx="78" cy="40" rx="7" ry="10" fill="${accent}" opacity="0.3"/>
				<ellipse cx="50" cy="66" rx="7" ry="14" fill="${secondary}"/>
				<ellipse cx="50" cy="66" rx="4" ry="8" fill="${accent}" opacity="0.3"/>
				<circle cx="40" cy="44" r="4.5" fill="white"/>
				<circle cx="60" cy="44" r="4.5" fill="white"/>
				<circle cx="41" cy="44" r="2.2" fill="${accent}"/>
				<circle cx="61" cy="44" r="2.2" fill="${accent}"/>
				<circle cx="42" cy="43" r="0.8" fill="white"/>
				<circle cx="62" cy="43" r="0.8" fill="white"/>
				<circle cx="50" cy="54" r="2.2" fill="${accent}"/>
				<ellipse cx="44" cy="76" rx="2.5" ry="1.5" fill="white" opacity="0.5"/>
				<ellipse cx="56" cy="76" rx="2.5" ry="1.5" fill="white" opacity="0.5"/>
			</svg>`,
	}

	return svgByAnimal[animal]
}

export interface UseAnimalAvatarOptions {
	size?: number
	palette?: number
}

export function useAnimalAvatar() {
	return useMemo(() => {
		function get(input: string, options?: UseAnimalAvatarOptions) {
			const hash = hashCode(input)
			const animalIndex = hash % ANIMALS.length
			const paletteIndex = options?.palette ?? (Math.floor(hash / ANIMALS.length) % PALETTES.length)
			const colors = PALETTES[paletteIndex % PALETTES.length]
			const animal = ANIMALS[animalIndex]

			return {
				animal,
				svg: getAnimalSVG(animal, colors),
				colors,
			}
		}

		return { get, ANIMALS, PALETTES }
	}, [])
}
