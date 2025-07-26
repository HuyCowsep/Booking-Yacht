import axios from "axios";
import {
  fetchImagesRequest,
  fetchImagesSuccess,
  fetchImagesFailure,
} from "../actions/imageActions";

export const fetchYachtImages = (yachtId) => async (dispatch) => {
  dispatch(fetchImagesRequest());
  try {
    // Đúng endpoint backend trả về mảng object { imageUrl, _id, ... }
    const response = await axios.get(
      `http://localhost:9999/api/v1/yachtImage/image/${yachtId}`
    );
    const images = response.data.data || [];
    const processedImages =
      images.length > 0
        ? images.map((img) => ({
            src: img.imageUrl,
            alt: `Yacht image ${img._id}`,
          }))
        : [{ src: "./images/yacht-8.jpg", alt: "Default Image" }];
    dispatch(fetchImagesSuccess(processedImages));
  } catch (error) {
    dispatch(fetchImagesFailure(error.message));
    dispatch(
      fetchImagesSuccess([
        { src: "./images/yacht-8.jpg", alt: "Default Image" },
      ])
    );
  }
};
