import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export function getLocalStorageUser() {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    return null;
}

export function getLocalStorageToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

export async function clearLocalStorage() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Failed to clear server token:', error);
        }

        return true;
    }
    return false;
}

export function getSessionOrUserId(): { session_id: string | null; user_id: number | null } {
    const localUser = localStorage.getItem('user');
    const localUserId = localUser ? JSON.parse(localUser).id : null;

    if (localUserId) {
        return {
            user_id: parseInt(localUserId, 10),
            session_id: null
        };
    }

    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID(); // or any UUID generator
        localStorage.setItem('session_id', sessionId);
    }

    return {
        user_id: null,
        session_id: sessionId
    };
}

export function getLocalStorageSessionId() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('session_id');
    }
    return null;
}
