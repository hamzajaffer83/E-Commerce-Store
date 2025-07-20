export async function GET() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiSecretKey = process.env.API_SECRET_KEY || '';

        const res = await fetch(`${apiUrl}/api/products/all`, {
            headers: {
                'ApiSecretKey': apiSecretKey
            }
        });

        if (!res.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch Laravel data' }), {
                status: res.status,
            });
        }

        const data = await res.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
            },
        });
    } catch (err) {
        console.error('Error fetching Laravel data:', err);

        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
        });
    }
}