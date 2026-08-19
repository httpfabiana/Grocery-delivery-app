import express from "express"
import multer from "multer";
import auth from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";

const uploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage})

uploadRouter.post("/", auth, upload.single("image"), async(req, res) => {
  try{
       if (!req.file) {
      return res.status(400).json({
        message: "No image file provided",
      });
    }

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "app-delivery",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file!.buffer);
    });

    return res.json({
      url: result.secure_url,
    });

  }catch(error: any) {
    console.error("UPLOAD ERROR:", error);
  
   return res.status(500).json({
    message: error.message,
   });
  }
})

uploadRouter.get("/test-upload", async (_req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      {
        folder: "app-delivery",
      }
    );

    return res.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error: any) {
    console.error("TEST UPLOAD ERROR:", error);

    return res.status(500).json({
      message: error.message,
      http_code: error.http_code,
      name: error.name,
    });
  }
});

export default uploadRouter;