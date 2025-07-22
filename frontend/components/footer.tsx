import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const appName = process.env.NEXT_PUBLIC_APP_NAME || '';

export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t text-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                {/*<div className="grid gap-8 md:grid-cols-4 sm:grid-cols-2">*/}
                {/*    /!* Brand *!/*/}
                {/*    <div>*/}
                {/*        <h2 className="text-2xl font-bold text-gray-900 mb-2">ShopNest</h2>*/}
                {/*        <p className="text-sm text-gray-600">*/}
                {/*            Premium quality products curated just for you. Shop smart, live better.*/}
                {/*        </p>*/}
                {/*    </div>*/}

                {/*    /!* Navigation *!/*/}
                {/*    <div>*/}
                {/*        <h3 className="text-lg font-semibold mb-3">Navigation</h3>*/}
                {/*        <ul className="space-y-2 text-sm">*/}
                {/*            <li><a href="#" className="hover:underline">Home</a></li>*/}
                {/*            <li><a href="#" className="hover:underline">Shop</a></li>*/}
                {/*            <li><a href="#" className="hover:underline">About</a></li>*/}
                {/*            <li><a href="#" className="hover:underline">Contact</a></li>*/}
                {/*        </ul>*/}
                {/*    </div>*/}

                {/*    /!* Support *!/*/}
                {/*    <div>*/}
                {/*        <h3 className="text-lg font-semibold mb-3">Support</h3>*/}
                {/*        <ul className="space-y-2 text-sm">*/}
                {/*            <li><a href="#" className="hover:underline">FAQs</a></li>*/}
                {/*            <li><a href="#" className="hover:underline">Shipping & Returns</a></li>*/}
                {/*            <li><a href="#" className="hover:underline">Privacy Policy</a></li>*/}
                {/*            <li><a href="#" className="hover:underline">Terms of Service</a></li>*/}
                {/*        </ul>*/}
                {/*    </div>*/}

                {/*    /!* Newsletter *!/*/}
                {/*    <div>*/}
                {/*        <h3 className="text-lg font-semibold mb-3">Join our Newsletter</h3>*/}
                {/*        <p className="text-sm text-gray-600 mb-4">*/}
                {/*            Get exclusive offers & updates in your inbox.*/}
                {/*        </p>*/}
                {/*        <div className="flex items-center space-x-2">*/}
                {/*            <Input type="email" placeholder="Your email" className="flex-1" />*/}
                {/*            <Button>Subscribe</Button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Bottom Row */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">&copy; 2025 {appName}. All rights reserved.</p>
                    <div className="flex space-x-4 text-gray-500">
                        <a href="#" className="hover:text-gray-700"><Facebook size={20} /></a>
                        <a href="#" className="hover:text-gray-700"><Instagram size={20} /></a>
                        <a href="#" className="hover:text-gray-700"><Twitter size={20} /></a>
                        <a href="#" className="hover:text-gray-700"><Youtube size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
