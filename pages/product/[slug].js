import Layout from '../../components/Layout';
// import { useRouter } from 'next/router';
import { useContext } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../Models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';

import { IoMdArrowRoundBack } from 'react-icons/io'
import { BsFacebook, BsInstagram, BsPinterest } from "react-icons/bs"

export default function ProductPage(props) {
  const { state, dispatch } = useContext(Store);
  const { product } = props;
  // const router = useRouter();

  if (!product) {
    return <Layout title="Product Not Found">Product not found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      toast.error(
        `Sorry! This product is either out of stock or we only have the amount in stock thats currently in your cart! Please contact us on information about when this item will be back in stock or if you need a quote on a bulk order. 😊`
      );
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    // router.push('/cart');
  };
  return (
    <Layout title={product.name}>

      <Link href="/"><IoMdArrowRoundBack className='w-16 h-6 mt-6'/></Link>
    <div className="lg:w-4/5 mx-auto grid md:grid-cols-2 md:gap-3">
      <Image 
        alt={product.name} 
        className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200" 
        src={`${product.image}`}
        width={640}
        height={640}
        layout="responsive"
        />
      <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
        
        <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.name}</h1>
        <div className="flex mb-4">
          <span className="flex items-center">
            <span className="text-gray-600 ml-3">{product.numReviews} Reviews</span>
          </span>
          <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
            <a className="text-gray-500">
              <BsFacebook />
            </a>
            <a className="ml-2 text-gray-500">
              <BsInstagram />
            </a>
            <a className="ml-2 text-gray-500">
              <BsPinterest />
            </a>
          </span>
        </div>
        <p className="leading-relaxed">{product.description}</p>
        <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
        <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
        </div>
        <div className="flex">
          <span className="title-font font-medium text-2xl text-gray-900">${product.price}</span>
          <button onClick={addToCartHandler} className="flex ml-auto primary-button">Add to cart</button>
        </div>
      </div>
    </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
