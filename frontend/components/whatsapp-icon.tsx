"use client";

import type { WhatsappData } from "@/types/data";
import Image from "next/image";

const WhatsAppIcon = ({ data }: { data: WhatsappData }) => {
  return (
    <div
      className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-green-500 hover:shadow-2xl z-50 flex items-center justify-center cursor-pointer"
      onClick={() => {
        if (data?.phone) {
          const message = data.message || "Hello! I’d like to get more info."; // fallback message
          const encodedMessage = encodeURIComponent(message);
          window.open(
            `https://wa.me/${data.phone}?text=${encodedMessage}`,
            "_blank"
          );
        }
      }}
    >
      <Image src='/Whatsapp.png' alt="Whatsapp" height={30} width={30} />
    </div>
  );
};

export default WhatsAppIcon;
