import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDown, ChevronRight, ImagePlus, Link2, MessageCircle, Palette } from 'lucide-react';
import { Settings } from 'lucide-react';

const sidebarLinks = [
    {
        title: 'Settings',
        icon: Settings,
        subLinks: [
            { title: 'Logo', icon: ImagePlus , href: '/admin/web-site/setting/site-logo' },
            { title: 'Footer Social Links', icon: Link2 , href: '/admin/web-site/setting/site-link' },
            { title: 'Whatsapp', icon: MessageCircle , href: '/admin/web-site/setting/whatsapp' },
            { title: 'Category Theme', icon: Palette , href: '/admin/web-site/setting/category-theme' },
        ],
    },
];

export default function NavDropdown() {
    const [openDropdown, setOpenDropdown] = useState(false);

    const toggleDropdown = () => {
        setOpenDropdown((prev) => !prev);
    };

    return (
        <aside className="text-sm px-1 space-y-2">
            {sidebarLinks.map((link) => (
                <div key={link.title}>
                        <div>
                            <button
                                onClick={toggleDropdown}
                                className="w-full flex items-center justify-between py-2 px-3 rounded  font-medium"
                            >
                                <div className="flex items-center gap-2">
                                    {link.icon && <link.icon className='h-4 w-4' />}
                                    <span>{link.title}</span>
                                </div>
                                {openDropdown ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>

                            {openDropdown && (
                                <div className="pl-4 mt-1 space-y-1 items-center ">
                                    {link.subLinks.map((sub) => (
                                        <Link href={sub.href} key={sub.title} className='flex py-1 px-2  text-sm  rounded-md hover:bg-gray-100/10 gap-2 items-center'>
                                            {sub.icon && <sub.icon className='h-4 w-4' />}
                                            <p>
                                            {sub.title}
                                        </p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                </div>
            ))}
        </aside>
    );
}
