import {Navbar}  from "@/components/nav-bar";
import CartInitializer from "@/app/CartInitializer";
import Footer from "@/components/footer";

export default function HomeLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            <Navbar/>
            {children}
            <Footer />
            <CartInitializer/>
        </section>
    )
}