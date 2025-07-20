'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUserSession, setCartFromServer } from '@/redux/cartSlice';
import { getLocalStorageSessionId, getLocalStorageUser } from '@/lib/service';

export default function CartInitializer() {
    const dispatch = useAppDispatch();
    const [id, setId] = useState<string | number | null>(null);
    // @ts-ignore
    const lastAddedItem = useAppSelector((state) => state.cart.lastAddedItem);

    // Step 1: Determine session/user ID
    useEffect(() => {
        const user = getLocalStorageUser();
        const session = getLocalStorageSessionId();

        if (user?.id) {
            // @ts-ignore
            dispatch(setUserSession({ user_id: user.id }));
            setId(user.id);
        } else if (session) {
            // @ts-ignore
            dispatch(setUserSession({ session_id: session }));
            setId(session);
        }
    }, [dispatch]);

    // Step 2: Fetch cart when ID is available (initial load)
    useEffect(() => {
        if (!id) return;

        const fetchCart = async () => {
            try {
                const res = await fetch(`/api/cart/${id}`, {
                    next: { revalidate: 3600 },
                });
                const data = await res.json();

                if (res.ok && data?.data) {
                    const Items = data.data.items;
                    dispatch(setCartFromServer(Items));
                } else {
                    console.warn('Cart response not OK:', data);
                }
            } catch (err) {
                console.error('Error fetching cart:', err);
            }
        };

        fetchCart();
    }, [id]);

    // Step 3: Refetch cart when a new item is added, once ID is ready
    useEffect(() => {
        if (!id || !lastAddedItem) return;

        const fetchCart = async () => {
            try {
                const res = await fetch(`/api/cart/${id}`);
                const data = await res.json();

                if (res.ok && data?.data) {
                    const Items = data.data.items;
                    dispatch(setCartFromServer(Items));
                } else {
                    console.warn('Cart response not OK:', data);
                }
            } catch (err) {
                console.error('Error fetching cart after add:', err);
            }
        };

        fetchCart();
    }, [lastAddedItem, id]); // Depend on both

    return null;
}
