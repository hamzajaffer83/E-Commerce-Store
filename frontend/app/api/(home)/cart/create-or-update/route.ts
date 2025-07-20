import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            session_id,
            user_id,
            cartItem,
        }: {
            session_id?: string;
            user_id?: number;
            cartItem?: {
                product_variation_id: number;
                quantity: number;
            }[];
        } = body;

        // Laravel-style validation
        if (!session_id && !user_id) {
            return NextResponse.json(
                { message: 'Either session_id or user_id is required' },
                { status: 400 }
            );
        }

        if (cartItem && !Array.isArray(cartItem)) {
            return NextResponse.json(
                { message: 'cartItem must be an array' },
                { status: 400 }
            );
        }

        if (
            cartItem?.some(
                (item) =>
                    !item.product_variation_id ||
                    !item.quantity ||
                    typeof item.quantity !== 'number' ||
                    item.quantity < 1
            )
        ) {
            return NextResponse.json(
                { message: 'Invalid product_variation_id or quantity in cartItem' },
                { status: 422 }
            );
        }

        // Forward to Laravel API
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiSecretKey = process.env.API_SECRET_KEY || '';

        const cartRes = await fetch(`${apiUrl}/api/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ApiSecretKey': apiSecretKey,
            },
            body: JSON.stringify(body),
        });

        const cartData = await cartRes.json();

        console.log(cartRes)

        if (!cartRes.ok) {
            return NextResponse.json(
                { message: cartData.message || 'Laravel cart API error' },
                { status: cartRes.status }
            );
        }

        return NextResponse.json(
            {
                message: 'Cart received and forwarded successfully',
                data: cartData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Cart error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
