import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import z from "zod";
import { logoCat } from "@/assets/svg/ilustrations";
import Otp from "@/components/shared/otp";
import { SVGIcon } from "@/components/shared/svg-icon";
import { api } from "@/libs/axios";
import { useToast } from "@/stores/toast-store";

const otpSchema = z.object({
	otp: z
		.string()
		.regex(/^\d+$/, { message: "The code can only contain numbers." })
		.min(6, { message: "Your code must be 6 characters long." }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

export default function OtpForm() {
	const toast = useToast();
	const location = useLocation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { fingerPrint } = location.state || {};
	const {
		watch,
		setValue,
		clearErrors,
		handleSubmit,
		formState: { errors },
	} = useForm<OTPFormValues>({
		mode: "all",
		resolver: zodResolver(otpSchema),
		defaultValues: { otp: "" },
	});

	const otpValue = watch("otp");

	type ApiError = AxiosError<{ message: string }>;

	const otpMutation = useMutation<unknown, ApiError, OTPFormValues>({
		mutationFn: async (data: OTPFormValues) => {
			const response = await api.post("/auth/sign-in/otp-verify", {
				fingerPrint,
				code: data.otp,
			});
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
			navigate("/");
		},
	});

	const resendMutation = useMutation<unknown, ApiError>({
		mutationFn: async () => {
			const response = await api.post("/auth/sign-in/otp-resend", {
				fingerPrint,
			});
			return response;
		},
		onSuccess: () => {
			toast.show({
				message: "Verification code resent successfully!",
			});
		},
	});

	const invalidateMutation = useMutation<unknown, ApiError, string>({
		mutationFn: async (fingerPrint: string) => {
			console.log("invalidateMutation ->", fingerPrint);
			await api.post("/auth/sign-in/otp-invalidate", { fingerPrint });
		},
	});

	const { isPending, isError, error: mutateError } = otpMutation;
	const { isPending: isResending } = resendMutation;

	const errorMessage =
		errors.otp?.message ??
		(isError
			? (mutateError?.response?.data?.message ??
				"Verification failed. Please try again.")
			: null);

	const onSubmit = (data: OTPFormValues) => otpMutation.mutate(data);

	const handleBackToSignIn = async () => {
		if (fingerPrint) {
			console.log("zzzzzzzzzz ->", fingerPrint);
			await invalidateMutation.mutateAsync(fingerPrint);
		}
		navigate("/signin");
	};

	// if (!fingerPrint) {
	// 	return null;
	// }

	return (
		<div className="d-flex flex-column">
			<div className="d-flex justify-content-center">
				<SVGIcon size={120} src={logoCat} alt="logo company" />
			</div>

			<span>
				Se ha enviado un código de verificación a tu correo electrónico. Ingresa
				el código para continuar.
			</span>

			<hr />

			<Otp
				value={otpValue}
				onChange={(v) => {
					setValue("otp", v);
					clearErrors("otp");
					otpMutation.reset();
				}}
				onComplete={() => handleSubmit(onSubmit)()}
				onResend={() => resendMutation.mutate()}
				onBack={handleBackToSignIn}
				isLoading={isPending}
				disabled={isPending}
				resendDisabled={isResending}
				error={errorMessage}
			/>
		</div>
	);
}
