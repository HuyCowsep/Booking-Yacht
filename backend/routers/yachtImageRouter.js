const express = require("express");
const router = express.Router();
const { getYachtImageById, addImageToYacht } = require("../controller/yachtImageController");
const { upload } = require("../utils/configClound");

router.get("/image/:id", getYachtImageById);
router.post("/addImage/:yachtId", upload.single("image"), addImageToYacht);
router.put("/updateImage/:idimage", upload.single("image"), require("../controller/yachtImageController").updateImageOfYacht);
router.delete("/deleteImage/:idimage", require("../controller/yachtImageController").deleteImageOfYacht);

module.exports = router;
