import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';
import { AiOutlineMenu, AiOutlineShopping } from "react-icons/ai";

export default function Layout({ title, children }) {
  const [showNav, setShowNav] = useState(false);

  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Stanli Jane' : 'Stanli Jane'}</title>
        <meta name="ecommerce website" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col md:justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md bg-[#6D374E] border-purple-100 text-white">
          {showNav ? (
            <AiOutlineMenu
              onClick={() => setShowNav(!showNav)}
              className="sm:hidden block w-10 h-10 p-2 cursor-pointer"
            />
          ) : (
            <AiOutlineMenu
              onClick={() => setShowNav(!showNav)}
              className="sm:hidden block w-10 h-10 p-2 cursor-pointer"
            />
          )} 
            <Link href="/">
              <a className="text-lg font-bold">Stanli Jane</a>
            </Link>
            <div className='flex items-center'>
              <div>
                <Link href="/cart">
                  <a className="p-2 flex items-center">
                  <AiOutlineShopping className='cursor-pointer ' size={35} />
                    {cartItemsCount < 10 && cartItemsCount > 0 && (
                      <span className="absolute ml-[13px]  mt-2 rounded-full text-[11px] text-white">
                        {cartItemsCount}
                      </span>
                    )}
                    {cartItemsCount > 9 && (
                      <span className="absolute ml-[11px]  mt-2 rounded-full text-[10px] text-white">
                        {cartItemsCount}
                      </span>
                    )}
                  </a>
                </Link>
              </div>
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/order-history">
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
              
            </div>
          </nav>
          <nav className="bg-[#E1D4DD]">
        <div className="py-1 px-4 mx-auto max-w-screen-xl sm:px-6">
        <div className="flex items-center w-full sm:block ">
          <ul className={
            (showNav ? "left-0" : "-left-full") +
            " sm:justify-between sm:static fixed rounded-xl bottom-15 top-12 sm:flex sm:space-x-7 items-center sm:bg-transparent bg-purple-100  sm:w-full w-full sm:space-y-0 space-y-5 p-2 transition-left "
            }>
            <li className="text-[#291427] hover:text-[#6d374e]">
              <Link href="/home" aria-current="page">Home</Link>
            </li>
            <li className=" text-[#291427]  ">
              <div className="group relative">
                <Link href="/">
                  <div className='hover:text-[#6d374e] cursor-pointer sm:absolute sm:z-20 sm:bg-[#E1D4DD] sm:pr-[100px] sm:py-[10px] sm:-top-5 '>Shop</div>
                </Link>
                <ul className="relative hidden sm:block sm:absolute sm:transition-all sm:duration-500 sm:-top-6 sm:group-hover:top-7">
                </ul>
              </div>
            </li>
            <li className="text-[#291427] hover:text-[#6d374e]">
                <Link href="/gallery">Gallery</Link>
            </li>
            {/* Patreon API link */}
            {/* <li>
                <Link to="/blog" className="drop-shadow-lg shadow-black text-[#291427] dark:text-purple-50 hover:underline hover:text-white">Blog</Link>
            </li> */}
            <li className="drop-shadow-lg shadow-black text-[#291427] hover:text-[#6d374e]">
                <Link href="/booking" >Soul Healing</Link>
            </li>
          </ul>
        </div>
        </div>
      </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 Amazona</p>
        </footer>
      </div>
    </>
  );
}
