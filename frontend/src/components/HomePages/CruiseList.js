import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Card, CardContent, CardMedia, CardActions, Button, Grid, Chip, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";

export default function CruiseList() {
  const [cruises, setCruises] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCruises = async () => {
      try {
        // Step 1: Lấy danh sách 6 du thuyền từ API không có cheapestPrice
        const resBasic = await axios.get("http://localhost:9999/api/v1/yachts", {
          params: { limit: 6 },
        });
        const yachtsBasic = Array.isArray(resBasic.data.data) ? resBasic.data.data : [];

        // Step 2: Lấy full danh sách có cheapestPrice
        const resWithPrice = await axios.get("http://localhost:9999/api/v1/yachts/findboat");
        const yachtsWithPrice = Array.isArray(resWithPrice.data.data) ? resWithPrice.data.data : [];

        // Step 3: Map lại để lấy giá từ findboat và gán vào yachtsBasic
        const combinedYachts = yachtsBasic.map((yacht) => {
          const match = yachtsWithPrice.find((y) => y._id === yacht._id);
          return {
            ...yacht,
            cheapestPrice: match?.cheapestPrice || null,
          };
        });

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

  return (
    <Box sx={{ maxWidth: 1240, mx: "auto", px: 2, py: 15 }}>
      <Typography variant="h4" fontWeight={800} mb={1} color="text.primary" fontFamily={"Archivo, sans-serif"} gutterBottom>
        Du thuyền mới và phổ biến nhất
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Tận hưởng sự xa hoa và đẳng cấp tối đa trên du thuyền mới nhất và phổ biến nhất. Khám phá một hành trình tuyệt
        vời đưa bạn vào thế giới của sự sang trọng, tiện nghi và trải nghiệm không thể quên.
      </Typography>
      <Typography mb={3} mt={-2}>
        <img src="/images/border.jpg" alt="border" width={100} />
      </Typography>
      <Grid container spacing={3}>
        {cruises.map((cruise) => (
          <Grid item xs={12} sm={6} md={4} key={cruise._id}>
            <Card
              sx={{
                borderRadius: 4,
                height: "100%",
                boxShadow: (theme) => theme.shadows[1],
                backgroundColor: (theme) => theme.palette.background.paper,
              }}
            >
              <CardMedia
                component="img"
                maxHeight="200"
                image={cruise.image || "không có ảnh"}
                alt={cruise.name}
                sx={{ objectFit: "cover", maxHeight: 220 }}
              />
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <LocationOnIcon color="primary" fontSize="small" />
                  <Typography variant="caption" color="text.secondary">
                    <Chip label={cruise.locationId?.name || "Không xác định"} color="primary" size="small" />
                  </Typography>
                </Stack>

                <Typography gutterBottom variant="subtitle1" fontWeight={600} sx={{ minHeight: 36, mb: 1 }}>
                  {cruise.name}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <DirectionsBoatIcon color="action" fontSize="small" />
                  <Typography variant="caption" color="text.secondary">
                    Hạ thuỷ {cruise.launch} - Thân vỏ {cruise.hullBody} - {cruise.yachtTypeId?.name || "Không xác định"}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <Typography variant="h6" color="primary">
                    {cruise.cheapestPrice ? `${cruise.cheapestPrice.toLocaleString()}đ / khách` : "chưa có giá"}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Sức chứa: {cruise.rule}
                    </Typography>
                    <PersonIcon color="action" fontSize="small" />
                  </Stack>
                </Stack>
              </CardContent>
              <CardActions sx={{ pt: 0, justifyContent: "center" }}>
                <Button variant="contained" color="primary" sx={{ borderRadius: 2, mb: 2, mx: 1, width: "50%" }}>
                  Đặt ngay
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} textAlign="center">
        <Button variant="outlined" color="primary" onClick={handleClick} sx={{ borderRadius: 3, border: "1.4px solid", px: 4, py: 1, fontSize: 16 }}>
          Xem tất cả du thuyền →
        </Button>
      </Box>
    </Box>
  );
}
