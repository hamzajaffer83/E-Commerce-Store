'use client';

import { setColor } from '@/redux/colorSlice';
import { useDispatch } from 'react-redux';

export const ColorInitiallizer = () => {

    const dispatch = useDispatch();
    dispatch(setColor("#ffffff"));
    return null
}
