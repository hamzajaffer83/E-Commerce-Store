'use client';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateLogo } from "@/redux/logoSlice";

export default function LogoClientInitializer({ logo }: { logo: string }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (logo) {
      dispatch(updateLogo(logo));
    }
  }, [logo, dispatch]);

  return null;
}
