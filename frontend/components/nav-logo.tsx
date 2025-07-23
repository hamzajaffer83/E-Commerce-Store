'use client';

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const NavLogo = () => {
  const logo = useSelector((state: RootState) => state.logo.logo);
  return (
    <Link href="/" className="mt-2">
      <Image src={logo} alt="Logo" width={70} height={8} />
    </Link>
  );
};

export default NavLogo;
