import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { setCurrentImageIndex, nextSlide, prevSlide, setImageHovering } from "../../redux/action";
import { fetchYachtImages } from "../../redux/asyncActions";
import { Box, IconButton, useTheme } from "@mui/material";

function ImageCarousel({ yachtId }) {
  const dispatch = useDispatch();
  const { images, currentIndex, isHovering } = useSelector((state) => state.images);
  const theme = useTheme();

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

  return (
    <Box sx={{ width: "100%", mt: 5, overflow: "hidden" }}>
      <Box sx={{ display: "flex", px: 3 }}>
        {/* Cột trái */}
        <Box
          sx={{
            width: "16.67%", // 1/6
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={images.length > 0 ? images[0].src : "./images/yacht-8.jpg"}
            alt={images.length > 0 ? images[0].alt : "Default Yacht Image"}
            sx={{
              objectFit: "cover",
              width: "100%",
              borderTopLeftRadius: 24,
              borderBottomLeftRadius: 24,
              height: "500px",
            }}
          />
          {showNavigation && (
            <IconButton
              onClick={() => dispatch(prevSlide())}
              sx={{
                position: "absolute",
                zIndex: 10,
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "action.hover" },
                boxShadow: theme.shadows[1],
              }}
              aria-label="Previous slide"
            >
              <ChevronLeft style={{ height: 24, width: 24, color: theme.palette.text.primary }} />
            </IconButton>
          )}
        </Box>

        {/* Cột giữa (carousel chính) */}
        <Box
          sx={{
            width: "66.67%", // 4/6
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
                px: 3,
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
            {images.map((thumb, index) => (
              <Box
                key={index}
                onClick={() => dispatch(setCurrentImageIndex(index))}
                sx={{
                  height: 64,
                  width: 64,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: 2,
                  borderColor: index === currentIndex ? "primary.contrastText" : "transparent",
                  borderRadius: 3,
                  opacity: index === currentIndex ? 1 : 0.8,
                }}
              >
                <Box
                  component="img"
                  src={thumb.src}
                  alt={`Thumbnail ${index + 1}`}
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    borderRadius: 3,
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Cột phải */}
        <Box
          sx={{
            width: "16.67%", // 1/6
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={images.length > 1 ? images[1].src : images.length > 0 ? images[0].src : "./images/yacht-8.jpg"}
            alt={images.length > 1 ? images[1].alt : images.length > 0 ? images[0].alt : "Default Yacht Image"}
            sx={{
              objectFit: "cover",
              width: "100%",
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
              height: "500px",
            }}
          />
          {showNavigation && (
            <IconButton
              onClick={() => dispatch(nextSlide())}
              sx={{
                position: "absolute",
                zIndex: 10,
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "action.hover" },
                boxShadow: theme.shadows[1],
              }}
              aria-label="Next slide"
            >
              <ChevronRight style={{ height: 24, width: 24, color: theme.palette.text.primary }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ImageCarousel;
