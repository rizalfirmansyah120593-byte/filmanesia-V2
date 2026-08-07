"use client";

import useBreakpoints from "@/hooks/useBreakpoints";
import { Language, useLanguage } from "@/i18n/LanguageProvider";
import { Accordion, AccordionItem } from "@heroui/react";

const FAQS: Record<Language, { title: string; description: string }[]> = {
  id: [
    { title: "Apa itu Filmanesia?", description: "Filmanesia membantu Anda menemukan film dan serial TV dengan mudah." },
    { title: "Apa yang kami lakukan?", description: "Kami mengumpulkan informasi dan tautan dari layanan pihak ketiga. Kami tidak menyimpan file film." },
    { title: "Video tidak bisa diputar karena iklan", description: "Kami tidak mengontrol iklan dari penyedia video. Jangan mengunduh file dari pop-up dan gunakan pemblokir iklan bila perlu." },
    { title: "Streaming lambat atau video tidak berjalan", description: "Coba pilih server lain melalui menu sumber di player. Setiap server memiliki kecepatan dan ketersediaan berbeda." },
    { title: "Apakah bisa mengunduh video?", description: "Filmanesia tidak menyediakan fitur unduh dan tidak menyimpan file media." },
    { title: "Apakah aman melakukan streaming?", description: "Gunakan layanan secara bertanggung jawab dan jangan mengunduh atau menyebarkan konten tanpa izin." },
  ],
  en: [
    { title: "What is Filmanesia?", description: "Filmanesia helps you discover movies and TV series easily." },
    { title: "What do we do?", description: "We collect information and links from third-party services. We do not store movie files." },
    { title: "The video cannot play because of ads", description: "We do not control ads from video providers. Do not download files from pop-ups and use an ad blocker if needed." },
    { title: "Streaming is slow or the video does not play", description: "Try another server from the player source menu. Each server has different speed and availability." },
    { title: "Can I download videos?", description: "Filmanesia does not provide downloads and does not store media files." },
    { title: "Is streaming safe?", description: "Use the service responsibly and do not download or share content without permission." },
  ],
  ms: [
    { title: "Apakah Filmanesia?", description: "Filmanesia membantu anda mencari filem dan siri TV dengan mudah." },
    { title: "Apakah yang kami lakukan?", description: "Kami mengumpulkan maklumat dan pautan daripada perkhidmatan pihak ketiga. Kami tidak menyimpan fail filem." },
    { title: "Video tidak boleh dimainkan kerana iklan", description: "Kami tidak mengawal iklan daripada penyedia video. Jangan muat turun fail daripada pop-up." },
    { title: "Striman perlahan atau video tidak dimainkan", description: "Cuba pelayan lain melalui menu sumber dalam pemain. Setiap pelayan mempunyai kelajuan berbeza." },
    { title: "Bolehkah saya memuat turun video?", description: "Filmanesia tidak menyediakan muat turun dan tidak menyimpan fail media." },
    { title: "Adakah striman selamat?", description: "Gunakan perkhidmatan secara bertanggungjawab dan jangan berkongsi kandungan tanpa kebenaran." },
  ],
};

const FAQ = () => {
  const { mobile } = useBreakpoints();
  const { language } = useLanguage();

  return (
    <Accordion variant="splitted" isCompact={mobile}>
      {FAQS[language].map(({ title, description }) => (
        <AccordionItem key={title} aria-label={title} title={title}>
          {description}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQ;
