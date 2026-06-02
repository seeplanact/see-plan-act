import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/admin.models.js';

dotenv.config();

const admins = [
  { name: 'milan',   email: 'beastt707@gmail.com',  password: 'milan@123',  role: 'admin' },
  { name: 'harsh',    email: 'harsh707@gmail.com',   password: 'harsh@123',   role: 'admin' },
  { name: 'anand',   email: 'anand707@gmail.com',  password: 'anand@123',  role: 'admin' },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  for (const a of admins) {
    const exists = await Admin.findOne({ email: a.email });
    if (exists) {
      console.log(`⚠️  Skipped  ${a.email} — already exists`);
      continue;
    }
    await Admin.create(a); // password auto-hashed by pre-save hook
    console.log(`✅  Created  ${a.email} (${a.role})`);
  }

  await mongoose.disconnect();
  console.log('Done.');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});