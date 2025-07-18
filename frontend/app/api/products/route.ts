export async function GET() {
    try {
        const appUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${appUrl}/api/products/all`);

        if (!res.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch Laravel data' }), {
                status: res.status,
            });
        }

        const data = await res.json();

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