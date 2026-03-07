import catchAsync from "../../utils/catchAsync";
import { getOptimizedImageUrl, slugifyFilename, uploadImageBuffer } from "../../utils/upload";

const uploadImage = catchAsync(async (req, res) => {
  const file = req.file;
  console.log([file])
 if (!file) throw new Error('No file uploaded');

 const publicId = slugifyFilename(file.originalname);

 const uploaded = await uploadImageBuffer(file.buffer, {
   folder: 'hatsmaster/uploads',
   publicId,
 });

 const optimizedUrl = getOptimizedImageUrl(uploaded.publicId, {
   width: 1200,
   height: 1200,
   crop: 'limit',
   gravity: 'auto',
   quality: 'auto',
   format: 'auto',
   dpr: 'auto',
 });

 res.status(201).json({
   success: true,
   data: { ...uploaded, optimizedUrl },
 });

})

export const uploadController = {
  uploadImage
}