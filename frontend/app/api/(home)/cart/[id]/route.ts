import { NextRequest } from 'next/server';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiSecretKey = process.env.API_SECRET_KEY || '';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        const response = await fetch(`${apiUrl}/api/cart/${id}`, {
            method: 'GET',
            headers: {
                'ApiSecretKey': apiSecretKey
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch Laravel data' }), {
                status: response.status,
            });
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
        });
    } catch (err) {
        console.error('Error fetching Laravel data:', err);

        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
        });
    }
}

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    console.log(id)
    try {
        const response = await fetch(`${apiUrl}/api/cart/${id}`, {
            method: 'DELETE',
            headers: {
                'ApiSecretKey': apiSecretKey,
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Fail to Clear Cart' }), {
                status: response.status,
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
        });
    }
}