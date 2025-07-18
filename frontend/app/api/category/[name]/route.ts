import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const name = url.pathname.split('/').pop();

        const appUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${appUrl}/api/product/category/${name}`);

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch Laravel data' }), {
                status: response.status,
            });
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Api-Secret-key': process.env.API_SECRET_KEY || '',
            },
        });
    } catch (err) {
        console.error('Error fetching Laravel data:', err);

        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
        });
    }
}
