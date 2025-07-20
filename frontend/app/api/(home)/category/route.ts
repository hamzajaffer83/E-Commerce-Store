export async function GET() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiSecretKey = process.env.API_SECRET_KEY || '';

        const res = await fetch(`${apiUrl}/api/categories/all`, {
            headers: {
                'ApiSecretKey': apiSecretKey
            }
        });

        if (!res.ok) {
            return new Response(JSON.stringify({ error: 'Internal server error. Please try again later.' }), {
                status: res.status,
            });
        }

        const data = await res.json();

        return new Response(JSON.stringify(data), {
            status: 200,
        });
    } catch (err) {
        console.error('Error fetching Laravel data:', err);

        return new Response(JSON.stringify({ error: 'Internal server error. Please try again later.' }), {
            status: 500,
        });
    }
}