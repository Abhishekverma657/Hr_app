import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name:"dnwo3a50t",
  api_key: "481464563844963",
  api_secret: "Lb1FWuUzTTQjzuiY1r-izGuxpHQ",
});

export default cloudinary;
