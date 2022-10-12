import User from '../../Models/User';
import data from '../../utils/data';
import db from '../../utils/db'
import Product from '../../Models/Product';


const handler = async ( req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products)
  await db.disconnect();
  res.send({ message: 'seeded successfully' });
};

export default handler;