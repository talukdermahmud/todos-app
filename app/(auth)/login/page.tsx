"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(4, "Password must be at least 4 characters."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    // Replace with real API from Postman collection
    console.log("Login:", data);
    // const res = await fetch("https://todo-app.pioneeralpha.com/api/users/login", { ... })
    // Save token → redirect to /todos
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-7">
      <div className="md:col-span-3 bg-[#E2ECF8] flex items-center justify-center p-8">
        <Image
          src="/images/signInImage.png"
          alt="People managing tasks"
          width={600}
          height={600}
          className="max-w-full h-auto"
        />
      </div>

      <div className="md:col-span-4 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900">
              Log in to your account
            </h1>
            <p className="text-gray-600 mt-2">
              Start managing your tasks efficiently
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-red-600 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
