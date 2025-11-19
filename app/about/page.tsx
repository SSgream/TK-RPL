"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-gray-950 text-white pt-24 pb-32">
      
      {/* SECTION TITLE */}
      <div className="text-center mt-20 mb-20">
        <h1 className="text-4xl md:text-5xl font-bold">
          Unit Kegiatan Mahasiswa
        </h1>
        <p className="text-slate-300 mt-4 max-w-3xl mx-auto">
          UKMT Merupakan Kelompok-Kelompok Khusus Yang Berada Di bawah
          Naungan Senat Mahasiswa Fakultas Teknik Universitas Hasanuddin
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto ml-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">

        {/* LEFT SIDE LIST */}
        <div>
          <h2 className="text-3xl font-semibold mb-6">UKM SMFT-UH 2025</h2>

          <ul className="space-y-3 text-lg leading-relaxed">
            <li>✓ ART 09 SMFT-UH</li>
            <li>✓ WELCOME 09 SMFT-UH</li>
            <li>✓ BASKETBALL 09 FT-UH</li>
            <li>✓ ENGINEERING FOOTBALL 09 FT-UH</li>
            <li>✓ TAEKWONDO 09</li>
            <li>✓ KOMTEK 09 SMFT-UH</li>
            <li>✓ TENNIS 09 SMFT-UH</li>
            <li>✓ NEXUS 09 SMFT-UH</li>
            <li>✓ PHILOCALIST 09 SMFT-UH</li>
            <li>✓ BADMINTON 09 SMFT-UH</li>
          </ul>
        </div>

        {/* IMAGE POSTER */}
        <div className="flex justify-center">
          <div className="rounded-xl border border-slate-600 overflow-hidden shadow-xl w-[90%] md:w-[420px] bg-white">
            <Image
              src="/poster.png"
              alt="Poster UKM"
              width={250}
              height={450}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
