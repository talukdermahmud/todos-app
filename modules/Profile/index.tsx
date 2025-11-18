"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateProfileImageMutation,
} from "../../lib/api";
import { ProfileFormData, profileSchema } from "../../lib/userSchemas";
import { useToaster } from "../../components/Toaster";

export default function ProfilePage() {
  const { showToast } = useToaster();
  const [avatar, setAvatar] = useState("/images/avatar.png");

  const { data: userData, isLoading, error, refetch } = useGetMeQuery({});
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        address: userData.address || "",
        contactNumber: userData.contact_number || "",
        birthday: userData.birthday ? new Date(userData.birthday) : undefined,
        bio: userData.bio || "",
      });
      const profileImageUrl =
        userData.profile_image?.replace(/^"|"$/g, "") || "/images/avatar.png";
      setAvatar(profileImageUrl);
    }
  }, [userData, reset]);

  const birthday = watch("birthday");

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateMe({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        address: data.address,
        contact_number: data.contactNumber,
        birthday: data.birthday
          ? data.birthday.toISOString().split("T")[0]
          : null,
        bio: data.bio,
      }).unwrap();
      await refetch();
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Update failed:", err);
      showToast("Failed to update profile. Please try again.", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        showToast("Please upload only JPG, JPEG, or PNG image files.", "error");
        e.target.value = ""; // Clear the input
        return;
      }

      // Set local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      try {
        const formData = new FormData();
        formData.append("profile_image", file);
        await updateProfileImage(formData).unwrap();
        const result = await refetch(); // Refetch user data to get the updated profile_image URL
        const profileImageUrl =
          result.data?.profile_image?.replace(/^"|"$/g, "") ||
          "/images/avatar.png";

        console.log(profileImageUrl);

        setAvatar(profileImageUrl); // Update to server URL
        showToast("Profile image updated successfully!", "success");
      } catch (err) {
        console.error("Image upload failed:", err);
        showToast("Failed to upload image. Please try again.", "error");
        // Revert to original
        const profileImageUrl =
          userData?.profile_image?.replace(/^"|"$/g, "") ||
          "/images/avatar.png";
        setAvatar(profileImageUrl);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl 2xl:max-w-7xl mx-auto mb-10">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 relative inline-block before:absolute before:bottom-0 before:left-1 before:w-2/3 before:h-0.5 before:bg-[#5272FF]">
            Account Information
          </h1>
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl 2xl:max-w-7xl mx-auto mb-10">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 relative inline-block before:absolute before:bottom-0 before:left-1 before:w-2/3 before:h-0.5 before:bg-[#5272FF]">
            Account Information
          </h1>
          <div className="text-red-500 text-center py-10">
            Failed to load profile data. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl 2xl:max-w-7xl mx-auto mb-10">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 relative inline-block before:absolute before:bottom-0 before:left-1 before:w-2/3 before:h-0.5 before:bg-[#5272FF]">
          Account Information
        </h1>
        {/* Avatar Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3">
          <div className="flex items-center gap-6 mb-10 border border-[#A1A3ABA1] p-3 rounded-xl  md:col-span-1">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
                <Image
                  src={avatar}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute bottom-2 right-2 rounded-full cursor-pointer transition">
                <Image
                  src="/icons/camera.png"
                  alt="Camera"
                  width={32}
                  height={32}
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <label className="flex items-center gap-2 bg-[#5272FF] text-white px-5 py-3 rounded-xl cursor-pointer whitespace-nowrap hover:bg-[#5286EF] transition">
              <Upload className="w-5 h-5" />
              Upload New Photo
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3 border border-[#A1A3ABA1] py-4 px-8 rounded-xl lg:col-span-1 xl:col-span-1">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {errors.firstName && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {errors.lastName && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.email && (
                <p className="mt-1 text-red-600 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Address & Contact Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Birthday */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Birthday
                </label>
                <input
                  type="date"
                  value={birthday ? birthday.toISOString().split("T")[0] : ""}
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : undefined;
                    setValue("birthday", date);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {errors.birthday && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.birthday.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  {...register("contactNumber")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+880 1XXX XXXXXX"
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Address
              </label>
              <input
                {...register("address")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Biography
              </label>
              <input
                {...register("bio")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting || isUpdating || !isDirty}
                className="bg-[#5272FF] hover:bg-[#5286EF] w-[200px]! h-10 cursor-pointer text-white font-semibold flex items-center justify-center px-8 py-3 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting || isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
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
