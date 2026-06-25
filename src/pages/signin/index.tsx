import SignInForm from "@components/blocks/signin/signin-form";
import { Card } from "react-bootstrap";
import { useLocation } from "react-router";
import Grainient from "@/components/shared/particles/grainient";
import { useThemeMode } from "@/hooks/use-theme-mode";
import OtpForm from "./otp-form";

function SignInPagePassword() {
	const location = useLocation();
  const { fingerPrint } = location.state || {};

  console.log('fingerPrint ->', fingerPrint)

	return <>{fingerPrint ? <OtpForm /> : <SignInForm />}</>;
}

export function Component() {
	const { themeMode } = useThemeMode();

	const isDark =
		themeMode === "dark" ||
		(themeMode === "system" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);
	const lightColors = {
		color1: "#e0dede",
		color2: "#161719",
		color3: "#201d24",
	};

	const darkColors = {
		color1: "#201d24",
		color2: "#e0dede",
		color3: "#161719",
	};
	const colors = isDark ? darkColors : lightColors;

	return (
		<div className="vh-100 position-relative overflow-hidden d-flex align-items-center justify-content-center">
			<style>{`
          .signin-form-wrapper {
            padding-top: env(safe-area-inset-top, 0px);
            padding-bottom: env(safe-area-inset-bottom, 0px);
          }
        `}</style>
			<div className="position-absolute top-0 start-0 w-100 h-100">
				<Grainient
					color1={colors.color1}
					color2={colors.color2}
					color3={colors.color3}
					timeSpeed={0.25}
					colorBalance={0}
					warpStrength={1}
					warpFrequency={5}
					warpSpeed={2}
					warpAmplitude={50}
					blendAngle={0}
					blendSoftness={0.05}
					rotationAmount={500}
					noiseScale={2}
					grainAmount={0.1}
					grainScale={2}
					grainAnimated={false}
					contrast={1.5}
					gamma={1}
					saturation={1}
					centerX={0}
					centerY={0}
					zoom={0.9}
				/>
			</div>

			<div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center signin-form-wrapper">
				<Card
					className="border-0 shadow-lg rounded-4 w-100"
					style={{ maxWidth: 400 }}
				>
					<Card.Body className="p-3">
						<SignInPagePassword />
					</Card.Body>
				</Card>
			</div>
		</div>
	);
}
