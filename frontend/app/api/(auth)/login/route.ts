import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        if (!body.email || !body.password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const apiSecretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY || ''

        const loginRes = await fetch(`${apiUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ApiSecretKey': apiSecretKey,
            },
            credentials: 'include', // required for Sanctum if using session-based auth
            body: JSON.stringify({
                email: body.email,
                password: body.password,
                session_id: body.session_id || null,
            }),
        })

        const result = await loginRes.json()

        console.log(result)

        if (!loginRes.ok) {
            return NextResponse.json({ message: result.error || "Login failed" }, { status: loginRes.status })
        }

        const { token, user } = result

        // Store token in secure cookie (or localStorage on client side)
        const response = NextResponse.json({ message: "Login successful", user, token }, { status: 200 })

        return response
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
