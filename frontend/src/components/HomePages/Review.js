import React, { useState } from "react";
import { Box, Typography, Avatar, Stack, Paper } from "@mui/material";

const testimonials = [
  {
    name: "Anh Dũng",
    cruise: "Du thuyền Emerald Dream",
    text: "Tôi và gia đình đã có một kỳ nghỉ vô cùng tuyệt vời trên du thuyền Emerald Dream. Không gian sang trọng, phòng nghỉ rộng rãi, ban công nhìn ra biển siêu đẹp. Chúng tôi được thưởng thức các món hải sản tươi ngon, đặc biệt là bữa tối trên boong tàu dưới ánh hoàng hôn, cực kỳ lãng mạn. Nhân viên phục vụ rất chu đáo, chuyên nghiệp. Một trải nghiệm xứng đáng 5 sao!",
    avatar: "https://i.pravatar.cc/40?img=0",
  },
  {
    name: "Anh Phạm Tuấn",
    cruise: "Du thuyền Royal Star",
    text: "Chuyến đi với Royal Star đã vượt xa mong đợi của tôi. Từ lúc check-in đến khi rời tàu, mọi thứ đều được sắp xếp chỉn chu. Tôi rất ấn tượng với tour tham quan hang Sửng Sốt và chèo kayak khám phá vịnh. Dịch vụ spa trên tàu rất thư giãn, giúp tôi hoàn toàn thoải mái sau hành trình dài.",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    name: "Anh Đức Huy",
    cruise: "Du thuyền Starlight Mikelner",
    text: "Trải nghiệm du thuyền Starlight Mikelner khiến tôi như bước vào một thế giới khác – yên bình và đẳng cấp. Tôi đặc biệt thích khu vực quầy bar và hồ bơi nước mặn. Âm nhạc nhẹ nhàng vào buổi tối cùng ly cocktail khiến tôi quên hết mệt mỏi thường nhật. Nhân viên rất thân thiện, luôn sẵn sàng hỗ trợ.",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    name: "Anh Danh Thực",
    cruise: "Du thuyền Halong Glory",
    text: "Một trong những kỳ nghỉ đáng nhớ nhất của tôi là trên du thuyền Halong Glory. Phòng ngủ cực kỳ sạch sẽ, view nhìn ra vịnh cực phẩm. Hướng dẫn viên giới thiệu về lịch sử vịnh Hạ Long rất thú vị. Bữa trưa buffet trên tàu đa dạng món và chất lượng miễn bàn. Tôi sẽ quay lại vào dịp lễ tới!",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    name: "Chị Trần Dương",
    cruise: "Du thuyền Paradise Elegance",
    text: "Du thuyền Paradise Elegance đúng là một nơi lý tưởng để tận hưởng kỳ nghỉ dưỡng xa hoa. Tôi bị mê hoặc bởi thiết kế nội thất tinh tế, từng chi tiết đều toát lên sự sang trọng. Chuyến đi 2 ngày 1 đêm nhưng đầy đủ hoạt động từ chèo thuyền kayak, câu mực đêm, cho đến lớp học nấu ăn. Tôi rất hài lòng!",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
  {
    name: "Cô C & E",
    cruise: "Du thuyền Sun Legend",
    text: "Chúng tôi đã có một chuyến nghỉ dưỡng hoàn hảo trên du thuyền Sun Legend. Cảnh biển đẹp như tranh vẽ, tiện nghi đầy đủ, và đặc biệt là đội ngũ nhân viên thân thiện, chuyên nghiệp. Mỗi bữa ăn là một trải nghiệm ẩm thực đáng nhớ. Đây sẽ là một kỷ niệm khó quên trong cuộc đời của hai chúng tôi!",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
];

export default function Review() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = testimonials[selectedIndex];

  return (
    <Box sx={{ width: "100%", py: 8, px: 2 }}>
      <Box maxWidth={900} mx="auto">
        <Typography variant="h5" fontWeight={700} mb={2} color="text.primary">
          Đánh giá từ những người đã trải nghiệm
        </Typography>
        <Typography mb={4} color="text.secondary">
          Khách hàng chia sẻ về những kỷ niệm tuyệt vời trên chuyến du lịch với chúng tôi.
        </Typography>
        <Typography mb={3} mt={-2}>
          <img src="/images/border.jpg" alt="border" width={100} />
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            px: { xs: 2, md: 4 },
            py: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid #e0e0e0",
            mb: 3,
            background: "url('https://ext.same-assets.com/834882384/1398955826.png') center/cover",
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        >
          <Typography variant="h4" fontWeight={800} mb={2} color="text.primary" fontFamily={"Archivo, sans-serif"}>
            {selected.cruise}
          </Typography>
          <Typography variant="body1" fontStyle="italic" color="text.secondary">
            “{selected.text}”
          </Typography>
          <Typography mt={2} variant="subtitle1" color="primary" fontWeight={700}>
            {selected.name} -
          </Typography>
        </Paper>

        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          {testimonials.map((c, idx) => (
            <Stack
              key={idx}
              alignItems="center"
              spacing={1}
              sx={{ cursor: "pointer" }}
              onClick={() => setSelectedIndex(idx)}
            >
              <Avatar
                src={c.avatar}
                alt={c.name}
                sx={{
                  border: idx === selectedIndex ? "3px solid #1976d2" : "3px solid transparent",
                  width: 48,
                  height: 48,
                  transition: "border 0.2s",
                }}
              />
              <Typography variant="caption" color="text.secondary" textAlign="center">
                {c.name}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
