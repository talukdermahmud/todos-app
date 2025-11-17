"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, Upload, Camera } from "lucide-react";
import Image from "next/image";
import formatDate from "../../utils/DateFormater";
import { profileSchema, ProfileFormData } from "../../lib/userSchemas";

export default function ProfilePage() {
  const [avatar, setAvatar] = useState("/images/avatar.png");
  const [showCalendar, setShowCalendar] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "Amanuel",
      lastName: "Tesfaye",
      email: "amanuel@gmail.com",
      address: "Dhaka, Bangladesh",
      contactNumber: "+880 123 456 789",
      birthday: new Date("1998-05-15"),
    },
  });

  const birthday = watch("birthday");

  const onSubmit = async (data: ProfileFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API
    console.log("Profile updated:", data);
    alert("Profile saved successfully!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 relative inline-block before:absolute before:bottom-0 before:left-1 before:w-2/3 before:h-0.5 before:bg-[#5272FF]">
          Account Information
        </h1>
        {/* Avatar Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-3!">
          <div className="flex items-center gap-6 mb-10 border border-[#A1A3ABA1] p-3 rounded-xl col-span-3 md:col-span-1">
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
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <label className="flex items-center gap-2 bg-[#5272FF] text-white px-5 py-3 rounded-xl cursor-pointer hover:bg-[#5286EF] transition">
              <Upload className="w-5 h-5" />
              Upload New Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 border border-[#A1A3ABA1] py-4 px-8 rounded-xl lg:col-span-1 xl:col-span-1">
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

            {/* Birthday */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Birthday
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={birthday ? formatDate(birthday) : ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white cursor-pointer focus:ring-2 focus:ring-blue-500"
                  placeholder="Select your birthday"
                  onClick={() => setShowCalendar(!showCalendar)}
                />
                <CalendarIcon className="absolute right-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.birthday && (
                <p className="mt-1 text-red-600 text-sm">
                  {errors.birthday.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#5272FF] hover:bg-[#5286EF] w-[200px] h-10 text-white font-semibold flex items-center justify-center px-8 py-3 rounded-xl transition disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="bg-[#8CA3CD] hover:bg-gray-500 w-[200px] h-10 text-white font-semibold px-8 py-3 rounded-xl transition flex items-center justify-center"
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
