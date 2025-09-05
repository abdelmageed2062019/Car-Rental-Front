"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { loginStart, loginSuccess, loginFailure } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AUTH_ENDPOINTS } from "@/lib/api";
import Loading from "@/components/ui/loading";

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

export function LoginForm({ onSwitchToRegister, onClose }: LoginFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginStart());
    try {
      const res = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const json = await res.json();
        const userData = json.data || json.user;
        const token = json.token;

        if (userData && token) {
          dispatch(loginSuccess({ user: userData, token }));
          onClose();
        } else {
          dispatch(loginFailure("Invalid response format"));
        }
      } else {
        const err = await res.json();
        dispatch(loginFailure(err.error || err.message || "Login failed"));
      }
    } catch {
      dispatch(loginFailure("Network error"));
    }
  };

  if (loading) {
    return (
      <Loading
        variant="auth"
        title="Signing in..."
        message="Please wait while we verify your credentials."
        size="md"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Enter your email address"
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-sm text-center">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:underline"
        >
          Create Account
        </button>
      </p>
    </form>
  );
}
