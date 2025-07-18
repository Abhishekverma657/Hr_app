import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

 export const compareFacesWithFacePP = async (img1, img2) => {
  const form = new URLSearchParams();
  form.append('api_key', process.env.FACEPP_API_KEY);
  form.append('api_secret', process.env.FACEPP_API_SECRET);
  form.append('image_url1', img1);
  form.append('image_url2', img2);

  const response = await axios.post(
    'https://api-us.faceplusplus.com/facepp/v3/compare',
    form.toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  const { confidence, thresholds } = response.data;

  const minConfidence = thresholds?.['1e-3'] || 70; // fallback if thresholds missing

  return {
    matched: confidence >= minConfidence,
    confidence,
    thresholds,
  };
};
