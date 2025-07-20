// app/api/cart/item/[id]/route.ts
import { NextRequest } from 'next/server';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiSecretKey = process.env.API_SECRET_KEY || '';

export async function PUT(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    try {
        const body = await req.json();
        const response = await fetch(`${apiUrl}/api/cart/item/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'ApiSecretKey': apiSecretKey,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: response.status });
    }  catch (err) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
        });
    }
}

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    try {
        const response = await fetch(`${apiUrl}/api/cart/item/${id}`, {
            method: 'DELETE',
            headers: {
                'ApiSecretKey': apiSecretKey,
            },
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: response.status });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
        });
    }
}
