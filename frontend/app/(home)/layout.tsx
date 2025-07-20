import {Navbar}  from "@/components/nav-bar";
import CartInitializer from "@/app/CartInitializer";

export default function HomeLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            <Navbar/>
            {children}
            <CartInitializer/>
        </section>
    )
}