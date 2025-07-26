import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  CardActions,
} from "@mui/material";
import { Link } from "react-router-dom";

const destinations = [
  {
    name: "Vịnh Hạ Long",
    image: "https://ext.same-assets.com/834882384/741241613.jpeg",
  },
  {
    name: "Đảo Quan Lạn",
    image: "https://ext.same-assets.com/834882384/1976775946.jpeg",
  },
  {
    name: "Đảo Cô Tô",
    image: "https://ext.same-assets.com/834882384/2063254602.jpeg",
  },
];

export default function Destination() {
  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 8 }}>
      <Typography
        variant="h4"
        fontWeight={800}
        mb={2}
        color="text.primary"
        fontFamily={"Archivo, sans-serif"}
        gutterBottom
      >
        <p>Các điểm đến của LongWave</p>
      </Typography>
      <Typography
        fontFamily={"Archivo, sans-serif"}
        color="text.secondary"
        mb={3}
      >
        Khám phá điểm du lịch tuyệt vời của Du thuyền Hạ Long. Hành trình đến
        thiên đường thiên nhiên.
      </Typography>
      <Typography mb={3} mt={-2}>
        <img src="/images/border.jpg" alt="border" width={100} />
      </Typography>
      <Grid container spacing={4}>
        {destinations.map((item, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card
              sx={{
                borderRadius: 2,
                height: "100%",
                boxShadow: (theme) => theme.shadows[1],
                backgroundColor: (theme) => theme.palette.background.paper,
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                height="175"
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  align="center"
                  color="text.primary"
                  fontFamily={"Archivo, sans-serif"}
                >
                  {item.name}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pt: 0 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/find-boat"
                  onClick={() => window.scrollTo(0, 0)}
                  sx={{
                    borderRadius: 2,
                    border: "1.4px solid",
                    mb: 2,
                    mx: 1,
                    width: "70%",
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 16,
                  }}
                >
                  Xem ngay
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} textAlign="center">
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/find-boat"
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
          Xem thêm các địa điểm →
        </Button>
      </Box>
    </Box>
  );
}
