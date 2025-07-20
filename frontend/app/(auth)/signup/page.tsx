'use client'

import { SignupForm } from "@/components/auth/signup-form";
import { useEffect, useState } from "react";
import { getLocalStorageToken } from "@/lib/service";
import {useRouter} from "next/navigation";

export default function SignupPage() {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        const storedToken = getLocalStorageToken();
        setToken(storedToken);
        router.push('/');
    }, []);

    if(token){
        return null;
    }
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <SignupForm />
            </div>
        </div>
    )
}