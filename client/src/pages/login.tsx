import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { authApi } from "@/api/auth.api";

import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const { data } = await authApi.login(values);

      login(data.token, data.user);

      toast.success("Logged in successfully");

      navigate("/");
    } catch {
      toast.error("Invalid credentials");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6">
        <h1 className="mb-6 text-2xl font-bold">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input type="email" placeholder="Email" {...register("email")} />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
