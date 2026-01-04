
import multer from 'multer'
const storage = multer.memoryStorage();
const singleUpload = multer({ storage }).single("imgUrl"); // Changed to "imgUrl"

export default singleUpload