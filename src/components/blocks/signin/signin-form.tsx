import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import AppButton from "@/components/shared/app-button";
import { signIn } from "@/pages/signin/signin.queries";
import { useToast } from "@/stores/toast-store";
import {
	type sigInFormSchemaType,
	signInschema,
} from "./signin-validation-schema";

const defaultValues = {
	email: "pink.steve.bits@gmail.com",
	password: "_EwN0fL4R9y{",
};

export default function SignInForm() {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const toast = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<sigInFormSchemaType>({
		defaultValues,
		resolver: zodResolver(signInschema),
	});

	const signInMutation = useMutation<
		{ message: string; fingerPrint: string },
		AxiosError<{ message: string }>,
		sigInFormSchemaType
	>({
		mutationFn: ({ email, password }: sigInFormSchemaType) =>
			signIn(email, password).then((res) => res.data),
		onSuccess: (data) => {
			toast.show({
				message:
					data.message ||
					"Sign in successful! Please check your email for the OTP.",
			});

			navigate("/signin", {
				state: {
					fingerPrint: data.fingerPrint,
				},
			});
		},
	});

	const onSubmit = (data: sigInFormSchemaType) => {
		signInMutation.mutate({ email: data.email, password: data.password });
	};

	return (
		<Form className="px-md-2 p-2" onSubmit={handleSubmit(onSubmit)} noValidate>
			<h2 className="fw-bold mb-1 mb-md-2">Iniciar sesión</h2>
			<p className="text-muted mb-3 mb-md-4">
				Ingresa tus credenciales para continuar
			</p>

			<hr />

			<Form.Group className="mb-3" controlId="email">
				<Form.Label>Correo electrónico</Form.Label>
				<div className="input-group">
					<span className="input-group-text">
						<Mail aria-hidden />
					</span>
					<Form.Control
						type="email"
						placeholder="correo@ejemplo.com"
						isInvalid={!!errors.email}
						{...register("email")}
					/>
					<Form.Control.Feedback type="invalid">
						{errors.email?.message}
					</Form.Control.Feedback>
				</div>
			</Form.Group>

			<Form.Group className="mb-3" controlId="password">
				<Form.Label>Contraseña</Form.Label>
				<div className="input-group">
					<span className="input-group-text">
						<Lock aria-hidden />
						<span>
							<span className="visually-hidden">Mostrar contraseña</span>
						</span>
					</span>
					<Form.Control
						type={showPassword ? "text" : "password"}
						placeholder="••••••••"
						isInvalid={!!errors.password}
						{...register("password")}
					/>
					<Button
						variant="outline-secondary"
						onClick={() => setShowPassword((v) => !v)}
						tabIndex={-1}
					>
						{showPassword ? <EyeClosed /> : <Eye />}
					</Button>
					<Form.Control.Feedback type="invalid">
						{errors.password?.message}
					</Form.Control.Feedback>
				</div>
			</Form.Group>

			<div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-4">
				<Form.Check type="checkbox" label="Recordarme" />
				<a href="#" className="text-decoration-none small">
					¿Olvidaste tu contraseña?
				</a>
			</div>

      <AppButton
        loading={signInMutation.isPending}
        type="submit"
				disabled={signInMutation.isPending || !isValid}
				className="w-100"
				variant="secondary"
			>
				{signInMutation.isPending ? "Ingresando..." : "Iniciar sesión"}
			</AppButton>
		</Form>
	);
}
