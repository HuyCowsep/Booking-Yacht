import React from "react";
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";

const articles = [
  {
    id: "bun-moc-ha-noi",
    title: "Top 5 quán bún mọc ở Hà Nội nhất định bạn phải thử",
    date: "18/05/2025",
    img: "https://storage.googleapis.com/a1aa/image/eaad327a-c20b-40e7-e982-352c9317fea2.jpg",
    intro:
      "Không chỉ có bún chả, bún hải sản… mà bún mọc Hà Nội cũng là một trong những món ăn làm nên sức hấp dẫn của ẩm thực Hà thành...",
  },
  {
    id: "banh-xiu-pao",
    title: "Bánh Xíu Páo Nam Định – Món Bánh Nhỏ Mang Hương Vị Lớn",
    desc: "Ẩm thực Nam Định từ lâu đã được biết đến với những món ăn vừa mộc mạc, vừa tinh tế – từ phở bò trứ danh...",
    date: "08/05/2025",
    img: "https://storage.googleapis.com/a1aa/image/b3a1307c-3297-4dc8-c733-411818cf45f4.jpg",
  },
  {
    id: "du-lich-ha-long",
    title: "Du lịch Hạ Long - thời gian nào là đẹp nhất?",
    desc: "Hạ Long là một trong những điểm du lịch hot nhất miền Bắc được rất nhiều du khách yêu thích. Không...",
    date: "24/04/2025",
    img: "https://storage.googleapis.com/a1aa/image/89346d98-2e05-4bec-8bd7-25e0035cf891.jpg",
  },
  {
    id: "bien-hoi-an",
    title: "Khám phá 5 bãi biển nổi bật tại Hội An cho mùa hè này",
    desc: "Hội An không chỉ thu hút du khách bởi vẻ đẹp cổ kính của những con phố rêu phong mà còn quyến rũ lòng...",
    date: "22/04/2025",
    img: "https://storage.googleapis.com/a1aa/image/5d022070-5037-46b2-9eeb-4b40e710d124.jpg",
  },
  {
    id: "lang-tam-o-hue",
    title: "Top 5 Lăng Tẩm Đẹp Nhất Ở Huế – Những Di Sản Trường Tồn Cùng Thời...",
    desc: "Huế – mảnh đất của những hoài niệm, nơi thời gian dường như chậm lại với tiếng chuông chùa, tiếng nư...",
    date: "18/04/2025",
    img: "https://storage.googleapis.com/a1aa/image/24c33b8c-a232-4173-4fd2-4ba39ca9d97d.jpg",
  },
];

export default function BlogList() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: (theme) =>
          theme.palette.mode === "light" ? `url(https://mixivivu.com/section-background.png)` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Bài viết mới nhất
        </Typography>

        <Grid container spacing={4}>
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardActionArea component={Link} to={`/blog/${article.id}`}>
                  <CardMedia component="img" height="300" image={article.img} alt={article.title} />
                  <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(article.intro || article.desc).substring(0, 100)}...
                    </Typography>

                    <Typography variant="caption" display="block" color="gray" mt={1}>
                      {article.date}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
