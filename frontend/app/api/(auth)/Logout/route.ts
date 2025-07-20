import { NextResponse } from 'next/server';

export async function POST() {
    // Clear cookie (set token cookie to expire immediately)
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.set('token', '', {
        httpOnly: true,
        secure: true,
        path: '/',
        expires: new Date(0), // immediately expire
    });
    return response;
}
