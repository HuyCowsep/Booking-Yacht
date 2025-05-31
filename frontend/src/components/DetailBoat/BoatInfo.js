import React from "react";
import { useSelector } from "react-redux";
import { FaAnchor, FaBed, FaShip, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import { Box, Paper, Typography, Stack, Grid, useTheme } from "@mui/material";

export default function BoatInfo() {
  const yacht = useSelector((state) => state.yacht.currentYacht);
  const theme = useTheme();

  if (!yacht) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: { xs: "100%", md: "33.33%" } }}>
      <Paper
        elevation={3}
        sx={{
          mx: "auto",
          p: 2,
          position: "relative",
          overflow: "hidden",
          bgcolor: "background.paper",
          borderRadius: 3.5,
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <Typography variant="h5" align="center" color="primary.main" mb={4} fontWeight="bold">
          Thông tin du thuyền
        </Typography>
        <Stack spacing={1.5}>
          <Box
            sx={{
              "&:hover": {
                bgcolor: "action.hover",
              },
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <Grid container alignItems="flex-start">
              <Grid item xs={4} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <FaAnchor size={22} color={theme.palette.text.secondary} />
                <Typography variant="body1" color="text.secondary">
                  Hạ thủy
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1" color="text.primary" fontWeight="medium" sx={{ pl: 5 }}>
                  {yacht.launch}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              "&:hover": {
                bgcolor: "action.hover",
              },
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <Grid container alignItems="flex-start">
              <Grid item xs={4} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <FaBed size={22} color={theme.palette.text.secondary} />
                <Typography variant="body1" color="text.secondary">
                  Cabin
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1" color="text.primary" fontWeight="medium" sx={{ pl: 5 }}>
                  20
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              "&:hover": {
                bgcolor: "action.hover",
              },
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <Grid container alignItems="flex-start">
              <Grid item xs={4} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <FaShip size={22} color={theme.palette.text.secondary} />
                <Typography variant="body1" color="text.secondary">
                  Thân vỏ
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1" color="text.primary" fontWeight="medium" sx={{ pl: 5 }}>
                  {yacht.hullBody}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              "&:hover": {
                bgcolor: "action.hover",
              },
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <Grid container alignItems="flex-start">
              <Grid item xs={5} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <FaMapMarkerAlt size={22} color={theme.palette.text.secondary} />
                <Typography variant="body1" color="text.secondary" sx={{ pt: 1.5 }}>
                  Hành trình
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body1" color="text.primary" fontWeight="medium" sx={{ pl: 2 }}>
                  {yacht.itinerary}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              "&:hover": {
                bgcolor: "action.hover",
              },
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <Grid container alignItems="flex-start">
              <Grid item xs={5} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <FaBuilding size={22} color={theme.palette.text.secondary} />
                <Typography variant="body1" color="text.secondary" sx={{ pt: 1.5 }}>
                  Điều hành
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body1" color="text.primary" fontWeight="medium" sx={{ pl: 2 }}>
                  {yacht.IdCompanys.name}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
