import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CardActions,
} from "@mui/material";
import { Link } from "react-router-dom";

const news = [
  {
    title: "Du lịch Hạ Long - thời gian nào là đẹp nhất?",
    img: "https://storage.googleapis.com/a1aa/image/89346d98-2e05-4bec-8bd7-25e0035cf891.jpg",
    desc: "Hạ Long là một trong những điểm du lịch hot nhất miền Bắc được rất nhiều du khách yêu thích. Không...",
    date: "24/05/2025",
    link: "/blog/du-lich-ha-long",
  },
  {
    title: "Top 5 quán bún mọc ở Hà Nội nhất định bạn phải thử",
    img: "https://ext.same-assets.com/834882384/3897759098.bin",
    desc: "Không chỉ có bún chả, bún hải sản mà bún mọc Hà Nội cũng là một trong những món ăn làm nên sức hấp dẫn của ẩm thực Hà thành.",
    date: "13/05/2025",
    link: "/blog/bun-moc-ha-noi",
  },
  {
    title: "Bánh xíu páo Nam Định – Món bánh nhỏ mang hương vị lớn",
    img: "https://ext.same-assets.com/834882384/1972871760.bin",
    desc: "Ẩm thực Nam Định tự lâu đã nổi tiếng với những món ăn vừa mộc mạc, vừa tinh tế từ phở bò trứ danh đến xíu páo, nem nắm Giao Thủy...",
    date: "13/05/2025",
    link: "/blog/banh-xiu-pao",
  },
];

export default function NewsList() {
  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        px: 2,
        py: 8,
        backgroundColor: (theme) => theme.palette.background.default,
        borderRadius: 2,
        boxShadow: (theme) => theme.shadows[2],
        color: (theme) => theme.palette.text.primary,
        fontFamily: "Archivo, sans-serif",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={800}
        mb={4}
        align="center"
        color="text.primary"
        fontFamily={"Archivo, sans-serif"}
      >
        Hạ Long: Khám phá Sự đặc sắc và Cập nhật tin tức mới nhất
      </Typography>

      <Grid container spacing={4} mb={2}>
        {news.map((n, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card
              component={Link}
              to={n.link}
              onClick={() => window.scrollTo(0, 0)}
              sx={{
                borderRadius: 2,
                boxShadow: (theme) => theme.shadows[1],
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: (theme) => theme.palette.background.paper,
                textDecoration: "none", // ⬅️ DÒNG NÀY BỎ GẠCH CHÂN
                color: "inherit", // ⬅️ Giữ nguyên màu chữ mặc định
                "&:hover": {
                  textDecoration: "none", // ⬅️ Chống hover bị underline lại
                },
              }}
            >
              <CardMedia
                component="img"
                image={n.img}
                alt={n.title}
                sx={{ objectFit: "cover", maxHeight: 250 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ minHeight: 50 }}
                  color="text.primary"
                  fontFamily={"Archivo, sans-serif"}
                >
                  {n.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minHeight: "4.5em",
                    fontFamily: "Archivo, sans-serif",
                  }}
                >
                  {n.desc}
                </Typography>
                <Typography
                  fontFamily={"Archivo, sans-serif"}
                  variant="caption"
                  color="text.secondary"
                >
                  {n.date}
                </Typography>
              </CardContent>
              <CardActions sx={{ pt: 0, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to={n.link}
                  onClick={() => window.scrollTo(0, 0)}
                  sx={{
                    borderRadius: 2,
                    border: "1.4px solid",
                    mb: 2,
                    mx: 2,
                    width: "70%",
                    fontFamily: "Archivo, sans-serif",
                  }}
                >
                  Xem chi tiết
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={5} textAlign="center">
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/blog"
          onClick={() => window.scrollTo(0, 0)}
          sx={{
            borderRadius: 3,
            border: "1.4px solid",
            px: 4,
            py: 1,
            fontSize: 16,
            fontFamily: "Archivo, sans-serif",
          }}
        >
          Xem tất cả →
        </Button>
      </Box>
    </Box>
  );
}
