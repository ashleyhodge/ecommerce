import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useContext } from "react";
import data from "../../utils/data";
import Link from "next/link";
import Image from "next/image";
import { Store } from "../../utils/Store";

export default function ProductPage() {
  const { state, dispatch } = useContext(Store);

  const router = useRouter();
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find(x => x.slug === slug);

  if(!product) {
    return <div>Product not found</div>
  }

  const addToCarthandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      alert(`Sorry! This product is either out of stock or we only have the amount in stock thats currently in your cart! Please contact us on information about when this item will be back in stock or if you need a quote on a bulk order. 😊`)
      return

    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  }
  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>{product.rating} of {product.numReviews} reviews</li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button className="primary-button w-full" onClick={addToCarthandler}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
