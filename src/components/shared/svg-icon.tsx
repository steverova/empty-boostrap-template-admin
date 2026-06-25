import { useThemeMode } from "@/hooks/use-theme-mode";
import { THEME_MODE } from "@/providers/theme-mode/theme-mode.provider";

interface SVGIconProps {
	src: string;
	alt: string;
	size?: number;
}

export function SVGIcon({ src, alt, size = 64 }: SVGIconProps) {
	const { themeMode } = useThemeMode();
	const isDark = themeMode === THEME_MODE.DARK;

	return (
		<img
			src={src}
			alt={alt}
			width={size}
			height={size}
			style={{ filter: isDark ? "invert(1)" : "none" }}
		/>
	);
}
