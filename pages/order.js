import Link from 'next/link'
import React, { useContext, useState } from 'react'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import Image from 'next/image';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router'

export default function PlaceOrder() {

  const {state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress } = cart;

  const round2 = (num) => (Math.round(num * 100) / 100).toFixed(2);

  const itemsPrice = cartItems.reduce((a, c) => a + c.quantity * c.price, 0) ///123.4567 => 123.46
  const shippingPrice = itemsPrice > 200 ? 0 : 15; // if total is over 200 shipping is free, if not it's 15
  const taxPrice = round2(itemsPrice * 0.12);
  const totalPrice = round2(itemsPrice + shippingPrice + (itemsPrice * 0.12));


  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      });
      setLoading(false);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  }
  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={2} />
      <h1 className='mb-4 text-xl'>Place Order</h1>
      {cartItems.length === 0 ? 
        (
          <div>
            Cart is empty. <Link href="/">Go shopping!</Link>
          </div>
        ) :
        (
          <div className='grid md:grid-cols-3 md:gap-3 mx-5'>
            <div className='overflow-x-auto md:col-span-3'>
              <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Order Items</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Item</th>
                    <th className='px-5 text-right'>Quantity</th>
                    <th className='px-5 text-right'>Price</th>
                    <th className='px-5 text-right'>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link href={`/product/${item.slug}`}>
                        <a className='flex items-center'>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </a>
                        </Link>
                      </td>
                      <td className='p-5 text-right'>{item.quantity}</td>
                      <td className='p-5 text-right'>$ {item.price}</td>
                      <td className='p-5 text-right'>
                        $ {item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/cart">Edit</Link>
              </div>
              </div>
            </div>

            <div className='card p-5 md:col-span-2'>
            <h2 className='mb-2 text-lg'>Shipping Address</h2>
                <div className='flex items-center'>
                  {shippingAddress.fullName}, {shippingAddress.address}, {' '}
                  {shippingAddress.city}, {shippingAddress.zipCode}, {' '}
                  {shippingAddress.country}
                </div>
                <Link href="/shipping">Edit</Link>


            </div>
            <div className='card  p-5 md:row-span-3'>
              <h2 className='mb-2 text-lg'>Order Summary</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Items</div>
                    <div>$ {itemsPrice}</div>
                  </div>
                </li>
                <li>  
                  <div className='mb-2 flex justify-between'>
                    <div>Tax</div>
                    <div>$ {taxPrice}</div>
                  </div>
                </li>  
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Shipping</div>
                    <div>$ {shippingPrice}</div>
                  </div>
                </li>  
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Total</div>
                    <div>$ {totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full"
                  >
                    {loading ? 'Loading...' : 'Pay Now'}
                  </button>
                </li>
              </ul>
            </div>
          </div>

        )
      }
    </Layout>
  )
}

// PlaceOrder.auth = true;