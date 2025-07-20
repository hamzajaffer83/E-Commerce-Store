'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorageToken } from "@/lib/service";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = getLocalStorageToken();
        if (storedToken) {
            setToken(storedToken);
            router.push('/'); // ✅ move push inside useEffect
        }
    }, [router]);

    // Optional: Prevent flicker by hiding form while checking token
    if (token) {
        return null;
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    );
}
