import Image from "next/image";

// src/components/layout/Header.tsx

export default function Header() {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-GB", {
    weekday: "long",
  });
  const dateString = today.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <Image
          src="/images/logo.png"
          width={105}
          height={32}
          className="h-8 w-[105px]"
          alt="Logo"
        />
        <div className="flex items-center gap-6">
          <button className="rounded-xl cursor-pointer">
            <Image
              src="/icons/Notifications.png"
              width={34}
              height={34}
              className="w-[34px] h-[34px]"
              alt="Notifications"
            />
          </button>
          <button className="rounded-xl cursor-pointer">
            <Image
              src="/icons/Cal.png"
              width={34}
              height={34}
              className="w-[34px] h-[34px]"
              alt="Calendar"
            />
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-500">{dayName}</p>
            <p className="font-semibold text-gray-900">{dateString}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
