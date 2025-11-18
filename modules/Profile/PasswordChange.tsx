"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useChangePasswordMutation, useGetMeQuery } from "../../lib/api";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "../../lib/userSchemas";
import { useToaster } from "../../components/Toaster";

export default function PasswordChange() {
  const { showToast } = useToaster();
  const router = useRouter();
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery({});
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword({
        old_password: data.oldPassword,
        new_password: data.newPassword,
      }).unwrap();

      reset();
      showToast("Password changed successfully!", "success");
    } catch (error) {
      console.error("Password change failed:", error);
      showToast("Failed to change password. Please try again.", "error");
    }
  };

  const handleCancel = () => {
    reset();
    router.push("/dashboard");
  };

  if (isUserLoading) {
    return (
      <div className="max-w-4xl 2xl:max-w-7xl mx-auto mb-10">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 relative inline-block before:absolute before:bottom-0 before:left-1 before:w-2/3 before:h-0.5 before:bg-[#5272FF]">
            Change Password
          </h1>
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-4xl 2xl:max-w-7xl mx-auto mb-10">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 relative inline-block before:absolute before:bottom-0 before:left-1 before:w-2/3 before:h-0.5 before:bg-[#5272FF]">
            Change Password
          </h1>
          <div className="text-red-500 text-center py-10">
            Unable to load user information. Please refresh the page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl 2xl:max-w-7xl mx-auto mb-10">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 relative inline-block before:absolute before:bottom-0 before:left-1 before:w-2/3 before:h-0.5 before:bg-[#5272FF]">
          Change Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 border border-[#A1A3ABA1] py-8 px-8 rounded-xl">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Current Password
              </label>
              <input
                {...register("oldPassword")}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your current password"
              />
              {errors.oldPassword && (
                <p className="mt-1 text-red-600 text-sm">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                New Password
              </label>
              <input
                {...register("newPassword")}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter your new password (minimum 8 characters)"
              />
              {errors.newPassword && (
                <p className="mt-1 text-red-600 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-red-600 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="bg-[#5272FF] hover:bg-[#5286EF] w-[200px]! h-10 cursor-pointer text-white font-semibold flex items-center justify-center px-8 py-3 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? "Changing..." : "Update"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-[#8CA3CD] hover:bg-gray-500 w-[200px]! h-10 cursor-pointer text-white font-semibold px-8 py-3 rounded-xl transition flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
