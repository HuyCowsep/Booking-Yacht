import React from "react";
import { Box, Typography, Grid, Card, CardMedia } from "@mui/material";

const partners = [
  "https://ext.same-assets.com/834882384/1475916938.png",
  "https://ext.same-assets.com/834882384/1216348293.png",
  "https://ext.same-assets.com/834882384/1658336896.png",
  "https://ext.same-assets.com/834882384/2956912027.png",
  "https://ext.same-assets.com/834882384/2169757183.png",
  "https://ext.same-assets.com/834882384/2544806471.png",
  "https://ext.same-assets.com/834882384/70805729.png",
  "https://ext.same-assets.com/834882384/2410236709.png",
  "https://ext.same-assets.com/834882384/63560133.png",
  "https://ext.same-assets.com/834882384/2458306925.png",
  "https://ext.same-assets.com/834882384/642037967.png",
  "https://ext.same-assets.com/834882384/701393398.png",
  "https://ext.same-assets.com/834882384/3082147983.png",
  "https://ext.same-assets.com/834882384/115243526.png",
];

export default function Partners() {
  return (
    <Box
      sx={{
        width: "100%",
        py: 8,
        px: 2,
      }}
    >
      <Box maxWidth={1100} mx="auto" px={2}>
        <Typography
          variant="h4"
          fontWeight={800}
          mb={4}
          align="center"
          color="text.primary"
          fontFamily={"Archivo, sans-serif"}
        >
          Đối tác cùng các Hãng Du thuyền Lớn
        </Typography>
        
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {partners.map((logo, idx) => (
            <Grid
              key={idx}
              item
              xs={4}
              sm={2}
              md={2}
              sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <Card
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light" ? "transparent" : theme.palette.background.paper,
                  boxShadow: (theme) => (theme.palette.mode === "light" ? "none" : theme.shadows[1]),
                  border: (theme) => (theme.palette.mode === "light" ? "none" : `1px solid ${theme.palette.divider}`),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                }}
              >
                <CardMedia
                  component="img"
                  image={logo}
                  alt={`logo-${idx}`}
                  sx={{
                    width: "100%",
                    maxWidth: 150,
                    objectFit: "contain",
                    filter: (theme) =>
                      theme.palette.mode === "light" ? "grayscale(100%)" : "grayscale(50%) brightness(120%)",
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
