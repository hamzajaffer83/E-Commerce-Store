// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const body = await req.json()

    // Optional: basic validation
    if (!body.name || !body.email || !body.password || !body.password_confirmation) {
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 })
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || '';
        const res = await fetch(`${apiUrl}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'ApiSecretKey': apiSecretKey
            },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (!res.ok) {
            return NextResponse.json({ message: data.message || 'Registration failed', errors: data.errors }, { status: res.status })
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.error('Laravel registration error:', error)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
