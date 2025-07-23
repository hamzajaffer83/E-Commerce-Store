import { Globe } from "lucide-react";
import Image from "next/image";

const appName = process.env.NEXT_PUBLIC_APP_NAME || '';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || '';

async function getSocialLink() {
    const res = await fetch(`${apiUrl}/api/footer-social-link`, {
        next: { revalidate: 3600 },
        headers: {
            'ApiSecretKey': apiSecretKey,
        }
    });

    if (!res.ok) {
        return [];
    }

    return res.json();
}

// Mapping function to return correct icon path or fallback React icon
const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'facebook':
            return '/Facebook.png';
        case 'instagram':
            return '/Instagram.png';
        case 'twitter':
            return '/Twitter.png';
        case 'youtube':
            return '/YouTube.png';
        case 'pinterest':
            return '/Pinterest.png';
        case 'tiktok':
            return '/TikTok.png';
        default:
            return null; // fallback handled separately
    }
};

export default async function Footer() {
    const data = await getSocialLink();

    return (
        <footer className="bg-gray-100 border-t text-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">&copy; 2025 {appName}. All rights reserved.</p>
                    <div className="flex space-x-4 text-gray-500">
                        {data?.data?.map((item: { name: string; link: string }, index: number) => {
                            const iconPath = getSocialIcon(item.name);
                            return (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gray-700"
                                    aria-label={item.name}
                                >
                                    {iconPath ? (
                                        <Image
                                            src={iconPath}
                                            height={20}
                                            width={20}
                                            alt={item.name}
                                        />
                                    ) : (
                                        <Globe size={20} />
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}
