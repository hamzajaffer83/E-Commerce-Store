'use client';

import React from 'react'
import NavLogo from './nav-logo'
import NavigationLinks from './navigation-links'
import CartIcon from './cart-icon'
import NavUser from './nav-user'
import SidebarLink from './sidebar-link'
import { Category } from '@/types/data'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const NavBarClient = ({ data }: { data: Category[] }) => {
    const color = useSelector((state: RootState) => state.color.value);
    return (
        <nav className="border-b shadow-xl" style={{ backgroundColor: color }} >
            <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-4 py-4">
                <NavLogo />
                <div className="hidden md:flex">
                    <NavigationLinks data={data} />
                </div>
                <div className="">
                    <div className="hidden md:flex items-center cursor-pointer space-x-4">
                        {/*<Search />*/}
                        <CartIcon />
                        <NavUser />
                    </div>
                    <div className="md:hidden gap-2">
                        <SidebarLink data={data} />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBarClient