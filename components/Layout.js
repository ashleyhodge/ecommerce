import Head from "next/head"
import Link from "next/link"
import { Store } from "../utils/Store"
import { useContext, useState, useEffect } from "react";

export default function Layout({ title, children }) {
  const { state } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0)
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0))
  }, [cart.cartItems])
  return (
    <>
    <Head>
        <title>{title ? title + '- Amazona' : 'Amazona'}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="flex flex-col min-h-screen justify-between">
      <header>
        <nav className="flex h-12 items-center justify-between shadow-md px-4">
          <Link href="/">
            <a className="text-lg font-bold">amazona</a>
          </Link>
          <div>
            <Link href="/cart">
              <a className="p-2">Cart
              {cartItemsCount > 0 && (
                <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
              </a>
            </Link>
            <Link href="/login">
              <a className="p-2">Login</a>
            </Link>
          </div>
        </nav>
      </header>
      <main className="container m-auto mt-4 px-4">
        {children}
      </main>
      <footer className="flex h-10 justify-center items-center shadow-inner">
        <p>Copyright &copy; 2022 Amazona</p>
      </footer>
    </div>
    </>

  )
}
