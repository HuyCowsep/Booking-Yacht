import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  setCurrentImageIndex,
  nextSlide,
  prevSlide,
  setImageHovering,
} from "../../redux/actions";
import { fetchYachtImages } from "../../redux/asyncActions";
import { Box, IconButton } from "@mui/material";
import { initialState } from "../../redux/reducers/imageReducer"; // Import initialState

function ImageCarousel({ yachtId }) {
  const dispatch = useDispatch();
  const {
    images = [],
    currentIndex = 0,
    isHovering = false,
    loading,
    error,
  } = useSelector((state) => state.images || initialState); // Sử dụng initialState làm fallback

  useEffect(() => {
    if (yachtId) {
      dispatch(fetchYachtImages(yachtId));
    }
  }, [dispatch, yachtId]);

  useEffect(() => {
    if (!isHovering && images.length > 1) {
      const interval = setInterval(() => {
        dispatch(nextSlide());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [dispatch, isHovering, images.length]);

  const showNavigation = images.length > 1;

  const leftIndex = (currentIndex - 1 + images.length) % images.length;
  const rightIndex = (currentIndex + 1) % images.length;

  const getThumbnailIndexes = () => {
    if (images.length <= 5) {
      // Nếu số ảnh <= 5, chỉ hiện đúng số lượng ảnh
      return images.map((_, idx) => idx);
    }
    // Nếu nhiều hơn 5 ảnh, lấy 5 thumbnail xung quanh currentIndex
    const thumbIndexes = [];
    thumbIndexes.push((currentIndex - 2 + images.length) % images.length);
    thumbIndexes.push((currentIndex - 1 + images.length) % images.length);
    thumbIndexes.push(currentIndex);
    thumbIndexes.push((currentIndex + 1) % images.length);
    thumbIndexes.push((currentIndex + 2) % images.length);
    return thumbIndexes;
  };

  const thumbnailIndexes = getThumbnailIndexes();

  if (loading)
    return (
      <Box sx={{ width: "100%", mt: 5, textAlign: "center" }}>
        Đang tải ảnh...
      </Box>
    );
  if (error)
    return (
      <Box sx={{ width: "100%", mt: 5, textAlign: "center" }}>Lỗi: {error}</Box>
    );
  if (!images || images.length === 0) {
    return (
      <Box sx={{ width: "100%", mt: 5, textAlign: "center" }}>
        Không có ảnh để hiển thị. Kiểm tra dữ liệu từ API fetchYachtImages.
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 5, overflow: "hidden" }}>
      <Box sx={{ display: "flex", px: 2 }}>
        <Box
          sx={{
            width: "16.67%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "500px",
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transition: "opacity 0.5s ease-in-out",
                opacity: index === leftIndex ? 1 : 0,
                zIndex: index === leftIndex ? 10 : 0,
              }}
            >
              <Box
                component="img"
                src={image.src}
                alt={image.alt}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                  borderTopLeftRadius: (theme) => theme.shape.borderRadius / 2,
                  borderBottomLeftRadius: (theme) =>
                    theme.shape.borderRadius / 2,
                  height: "500px",
                }}
              />
            </Box>
          ))}
          {showNavigation && (
            <IconButton
              onClick={() => dispatch(prevSlide())}
              sx={{
                position: "absolute",
                zIndex: 20,
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "action.hover" },
                boxShadow: (theme) => theme.shadows[1],
              }}
              aria-label="Previous slide"
            >
              <ChevronLeft
                sx={{ height: 24, width: 24, color: "text.primary" }}
              />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            width: "66.67%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "500px",
          }}
          onMouseEnter={() => dispatch(setImageHovering(true))}
          onMouseLeave={() => dispatch(setImageHovering(false))}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                px: 2,
                transition: "opacity 0.5s ease-in-out",
                opacity: index === currentIndex ? 1 : 0,
                zIndex: index === currentIndex ? 10 : 0,
              }}
            >
              <Box
                component="img"
                src={image.src}
                alt={image.alt}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                  height: "500px",
                }}
              />
            </Box>
          ))}
          <Box
            sx={{
              position: "absolute",
              bottom: 2,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
              display: "flex",
              gap: 1,
            }}
          >
            {thumbnailIndexes.map((thumbIndex, displayIndex) => (
              <Box
                key={displayIndex}
                onClick={() => dispatch(setCurrentImageIndex(thumbIndex))}
                sx={{
                  height: 64,
                  width: 64,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: 3,
                  borderColor:
                    thumbIndex === currentIndex
                      ? "primary.contrastText"
                      : "transparent",
                  borderRadius: (theme) => theme.shape.borderRadius / 2,
                  opacity: thumbIndex === currentIndex ? 1 : 0.6,
                  transition: "opacity 0.5s ease-in-out",
                }}
              >
                <Box
                  component="img"
                  src={images[thumbIndex].src}
                  alt={`Thumbnail ${thumbIndex + 1}`}
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    borderRadius: (theme) => theme.shape.borderRadius / 4,
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            width: "16.67%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "500px",
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",

                transition: "opacity 0.5s ease-in-out",
                opacity: index === rightIndex ? 1 : 0,
                zIndex: index === rightIndex ? 10 : 0,
              }}
            >
              <Box
                component="img"
                src={image.src}
                alt={image.alt}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                  borderTopRightRadius: (theme) => theme.shape.borderRadius / 2,
                  borderBottomRightRadius: (theme) =>
                    theme.shape.borderRadius / 2,
                  height: "500px",
                }}
              />
            </Box>
          ))}
          {showNavigation && (
            <IconButton
              onClick={() => dispatch(nextSlide())}
              sx={{
                position: "absolute",
                zIndex: 20,

                bgcolor: "background.paper",
                "&:hover": { bgcolor: "action.hover" },
                boxShadow: (theme) => theme.shadows[1],
              }}
              aria-label="Next slide"
            >
              <ChevronRight
                sx={{ height: 24, width: 24, color: "text.primary" }}
              />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ImageCarousel;
