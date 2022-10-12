import React from 'react'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'

export default function Payment() {
  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className='mx-auto max-w-screen-md'>
        <h1>Payment Method</h1>
      </form>
    </Layout>
  )
}
