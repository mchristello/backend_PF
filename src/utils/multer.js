import multer from "multer";
import { __dirname } from '../dirname.js';

console.log(__dirname);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = `${__dirname}/public/${file.fieldname}`;

        switch (file.fieldname) {
            case "profiles":
                cb(null, path);
                break;
            case "products":
                cb(null, path);
                break;
            case "documents":
                cb(null, path);
                break;
            default:
                break;
        }
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})


export default upload;