import type {
	ButtonHTMLAttributes,
	PropsWithChildren,
} from 'react'
import styled from 'styled-components'

interface IconButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		PropsWithChildren {
	size?: number
	'aria-label': string
}

const IconButtonStyled = styled.button<{ $size: number }>`
	display: inline-flex;
	align-items: center;
	justify-content: center;

	width: ${({ $size }) => `${$size}px`};
	height: ${({ $size }) => `${$size}px`};

	padding: 0;
	border: none;
	border-radius: 8px;

	background: transparent;
	color: inherit;
	cursor: pointer;

	transition:
		background-color 0.2s ease,
		transform 0.1s ease;

	&:hover:not(:disabled) {
		background-color: rgba(127, 127, 127, 0.08);
	}

	&:active:not(:disabled) {
		transform: scale(0.96);
	}

	&:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Evita problemas de alineación con SVGs */
	svg {
		flex-shrink: 0;
	}
`

export default function IconButton({
	size = 36,
	type = 'button',
	children,
	...props
}: IconButtonProps) {
	return (
		<IconButtonStyled
			$size={size}
			type={type}
			{...props}
		>
			{children}
		</IconButtonStyled>
	)
}