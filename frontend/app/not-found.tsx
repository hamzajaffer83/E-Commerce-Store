'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    document.title = 'Page Not Found';
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-green-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>
        <button
          onClick={() => router.back()}
          className="flex w-full items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          <ArrowLeft /> Go Back
        </button>
      </div>
    </div>
  );
}
