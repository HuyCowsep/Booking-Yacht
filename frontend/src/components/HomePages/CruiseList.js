import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, CardContent, CardMedia, CardActions, Button, Grid, Chip, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

export default function CruiseList() {
  const [cruises, setCruises] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCruises = async () => {
      try {
        // Step 1: Fetch list of 6 yachts from API without cheapestPrice
        const resBasic = await axios.get("http://localhost:9999/api/v1/yachts", {
          params: { limit: 6 },
        });
        const yachtsBasic = Array.isArray(resBasic.data.data) ? resBasic.data.data : [];

        // Step 2: Fetch full list with cheapestPrice
        const resWithPrice = await axios.get("http://localhost:9999/api/v1/yachts/findboat");
        const yachtsWithPrice = Array.isArray(resWithPrice.data.data) ? resWithPrice.data.data : [];

        // Step 3: Fetch images for each yacht and select the first image
        const combinedYachts = await Promise.all(
          yachtsBasic.map(async (yacht) => {
            const match = yachtsWithPrice.find((y) => y._id === yacht._id);
            // Fetch image for the yacht
            let imageUrl = "/images/placeholder.jpg"; // Hình ảnh dự phòng mặc định
            try {
              const imageRes = await axios.get(`http://localhost:9999/api/v1/yachtImages/yacht/${yacht._id}`);
              if (imageRes.data.success && Array.isArray(imageRes.data.data) && imageRes.data.data.length > 0) {
                imageUrl = imageRes.data.data[0]; // Chọn hình ảnh đầu tiên từ mảng
              }
            } catch (imageErr) {
              console.error(`Error fetching image for yacht ${yacht._id}:`, imageErr);
            }

            return {
              ...yacht,
              cheapestPrice: match?.cheapestPrice || null,
              image: imageUrl, // Thêm imageUrl đầu tiên vào đối tượng du thuyền
            };
          })
        );

        setCruises(combinedYachts);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách du thuyền:", err);
      }
    };

    fetchCruises();
  }, []);

  const handleClick = () => {
    navigate("/find-boat");
    window.scrollTo({ top: 0 });
    setTimeout(() => {
      window.location.reload();
    }, 20);
  };

  // Hàm trợ giúp định dạng giá bằng dấu phẩy
  const formatPrice = (price) => {
    if (!price && price !== 0) return "chưa có giá";
    console.log("Giá du thuyền:", price);
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ / khách";
  };

  return (
    <Box sx={{ maxWidth: 1240, mx: "auto", px: 2, py: 15 }}>
      <Typography
        variant="h4"
        fontWeight={800}
        mb={1}
        color="text.primary"
        fontFamily={"Archivo, sans-serif"}
        gutterBottom
      >
        Du thuyền mới và phổ biến nhất
      </Typography>
      <Typography color="text.primary" fontFamily={"Archivo, sans-serif"} mb={3}>
        Tận hưởng sự xa hoa và đẳng cấp tối đa trên du thuyền mới nhất và phổ biến nhất. Khám phá một hành trình tuyệt
        vời đưa bạn vào thế giới của sự sang trọng, tiện nghi và trải nghiệm không thể quên.
      </Typography>
      <Typography mb={6} fontFamily={"Archivo, sans-serif"} mt={-2}>
        <img src="/images/border.jpg" alt="border" width={100} />
      </Typography>
      <Grid container spacing={3}>
        {cruises.map((cruise) => (
          <Grid item xs={12} sm={6} md={4} key={cruise._id}>
            <Link to={`/boat-detail/${cruise._id}`} style={{ textDecoration: "none" }}>
              <Card
                sx={{
                  borderRadius: 2,
                  height: "100%",
                  boxShadow: (theme) => theme.shadows[1],
                  backgroundColor: (theme) => theme.palette.background.paper,
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                <CardMedia
                  component="img"
                  maxHeight="200"
                  image={cruise.image} //Sử dụng first imageUrl
                  alt={cruise.name}
                  sx={{ objectFit: "cover", maxHeight: 220 }}
                />
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} borderRadius={1} mb={2} width="fit-content">
                    <LocationOnIcon color="primary" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      <Chip label={cruise.locationId?.name || "Không xác định"} color="primary" size="small" />
                    </Typography>
                  </Stack>

                  <Typography
                    gutterBottom
                    variant="h6"
                    fontWeight={600}
                    fontFamily={"Archivo, sans-serif"}
                    sx={{ minHeight: 36, mb: 1, color: "text.primary" }}
                  >
                    {cruise.name}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <DirectionsBoatIcon color="action" fontSize="small" />
                    <Typography
                      variant="caption"
                      fontFamily={"Archivo, sans-serif"}
                      color="text.primary"
                      sx={{ fontWeight: 500 }}
                    >
                      Hạ thuỷ {cruise.launch} - Thân vỏ {cruise.hullBody} -{" "}
                      {cruise.yachtTypeId?.name || "Không xác định"}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h6" fontFamily={"Archivo, sans-serif"} color="text.primary" fontWeight={700}>
                      {formatPrice(cruise.price)}
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ pt: 0, justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 2, mb: 2, mx: 1, width: "50%", fontFamily: "Archivo, sans-serif" }}
                  >
                    Đặt ngay
                  </Button>
                </CardActions>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} textAlign="center">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClick}
          sx={{ borderRadius: 3, border: "1.4px solid", px: 4, py: 1, fontSize: 16, fontFamily: "Archivo, sans-serif" }}
        >
          Xem tất cả du thuyền →
        </Button>
      </Box>
    </Box>
  );
}
