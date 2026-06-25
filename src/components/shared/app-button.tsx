import type { ReactNode } from "react";
import { Button, type ButtonProps } from "react-bootstrap";

interface AppButtonProps extends Omit<ButtonProps, "variant"> {
	variant?: ButtonProps["variant"];
	startIcon?: ReactNode;
	endIcon?: ReactNode;
	loading?: boolean;
	loadingText?: string;
}

export default function AppButton({
	className,
	children,
	variant = "primary",
	startIcon,
	endIcon,
	loading = false,
	loadingText,
	disabled,
	type = "button",
	...props
}: AppButtonProps) {
	const isDisabled = disabled || loading;

	return (
		<Button
			variant={variant}
			className={className}
			disabled={isDisabled}
			aria-busy={loading}
			type={type}
			{...props}
		>
			<span className="d-flex align-items-center justify-content-center gap-2">
				{loading ? (
					<span className="d-flex align-items-center justify-content-center gap-2">
						<span
							className="spinner-border spinner-border-sm"
							role="status"
							aria-label="Cargando"
						/>
						<span>{loadingText ?? children}</span>
					</span>
				) : (
					<>
						{startIcon && <span aria-hidden="true">{startIcon}</span>}
						{children}
						{endIcon && <span aria-hidden="true">{endIcon}</span>}
					</>
				)}
			</span>
		</Button>
	);
}
