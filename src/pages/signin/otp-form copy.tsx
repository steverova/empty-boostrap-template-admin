import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import z from "zod";
import Otp from "@/components/shared/otp";
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
  const toast = useToast()
	const location = useLocation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { fingerPrint } = location.state || {};
	const [otp6, setOtp6] = useState("");
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<OTPFormValues>({
		mode: "all",
		resolver: zodResolver(otpSchema),
		defaultValues: { otp: "" },
	});

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
        message: 'Verification code resent successfully!'
      })
		},
	});

	const invalidateMutation = useMutation<unknown, ApiError, string>({
		mutationFn: async (fingerPrint: string) => {
			await api.post("/auth/sign-in/otp-invalidate", { fingerPrint });
		},
	});

	const { isPending, isError, isSuccess, error: mutateError } = otpMutation;
	const { isPending: isResending, isSuccess: isResendSuccess } = resendMutation;

	const isFieldInvalid = isError || !!errors.otp;

	const onSubmit = (data: OTPFormValues) => otpMutation.mutate(data);

	const handleBackToSignIn = async () => {
		if (fingerPrint) {
			await invalidateMutation.mutateAsync(fingerPrint);
		}
		navigate("/signin");
	};

	if (!fingerPrint) {
		return null;
	}

	return (
		<Otp
			value={otp6}
			onChange={setOtp6}
			onComplete={(v) => {
				console.log("OTP 6:", v);
			}}
		/>
	);
}
