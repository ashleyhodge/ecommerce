
import Layout from '../components/Layout'
import ProductItem from '../components/ProductItem'
import db from '../utils/db';
import Product from '../Models/Product';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import axios from 'axios';
import { toast } from 'react-toastify'


export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`)

    if (data.countInStock < quantity) {
      return toast.error(`Sorry! This product is either out of stock or we only have the amount in stock thats currently in your cart! Please contact us on information about when this item will be back in stock or if you need a quote on a bulk order. 😊`)
      

    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to cart')
  }
  return (
    <Layout title="Homepage">
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <ProductItem product={product} key={product.slug} 
          addToCartHandler={addToCartHandler}/>
        ))}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj)
    }}
}
