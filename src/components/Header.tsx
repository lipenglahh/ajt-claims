'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinkClasses = (path: string) => {
    return pathname === path ? 'text-black font-bold' : 'text-gray-500';
  };

  return (
    <header className="bg-orange-500 shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-center items-center">
        <div className="text-2xl font-bold text-white">AJT Claims</div>

      </nav>
    </header>
  );
}
