import React, { useState } from "react";
import { Container, Typography, Box, Collapse, useTheme, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ = () => {
  const staticInfo = [
    {
      title: "Thời gian nhận phòng",
      content:
        "Giờ nhận phòng từ 12h15-12h30. Nếu quý khách không sử dụng dịch vụ xe đưa đón của tàu và tự di chuyển, vui lòng có mặt tại bến tàu muộn nhất là 11h45 để làm thủ tục trước khi lên tàu.",
    },
    {
      title: "Thời gian trả phòng",
      content:
        "Giờ trả phòng từ 9h30-10h30 tùy thuộc vào lịch trình của tàu. Sau khi trả phòng, quý khách sẽ được phục vụ bữa trưa trên tàu trước khi tàu cập bến.",
    },
    {
      title: "Chính sách hủy phòng",
      content:
        "Đặt phòng không được hoàn/hủy nhưng có thể đổi ngày nếu thông báo trước ít nhất 7 ngày. Vui lòng liên hệ để được hỗ trợ.",
    },
  ];

  const faqData = [
    {
      question: "Dịch vụ xe đưa đón có bao gồm trong giá tour không?",
      answer: "Xe đưa đón 2 chiều không bao gồm trong giá tour. Quý khách có thể đặt thêm dịch vụ này.",
    },
    {
      question: "Nhà hàng của du thuyền phục vụ bữa ăn theo phong cách gì?",
      answer:
        "Thức ăn của nhà hàng sẽ được phục vụ các món ăn theo phong cách Việt và Âu. Nếu quý khách có yêu cầu riêng, vui lòng thông báo trước ít nhất 03 ngày với du thuyền.",
    },
    {
      question: "Tôi có được phép mang thú cưng lên tàu không?",
      answer: "Thú cưng không được phép mang lên du thuyền.",
    },
    {
      question: "Du thuyền có dịch vụ massage không?",
      answer: "Có. Du thuyền cung cấp dịch vụ massage chuyên nghiệp có tính phí (không bao gồm trong giá tour).",
    },
    {
      question: "Nếu ngày đi tour của tôi đúng vào sinh nhật thì có ưu đãi gì không?",
      answer:
        "Du thuyền sẽ tặng bánh sinh nhật nhỏ và có thể chuẩn bị các dịch vụ đặc biệt (trang trí, bàn ăn riêng...) nếu được thông báo trước.",
    },
    {
      question: "Trên tàu có wifi không? Tốc độ mạng ổn không vậy?",
      answer:
        "Có wifi miễn phí nhưng tốc độ phụ thuộc vào vị trí và thời tiết, đôi khi mạng sẽ chập chờn do ở xa đất liền.",
    },
    {
      question: "Tôi ăn chay / dị ứng hải sản thì có được phục vụ món đặc biệt không?",
      answer: "Được nha quý khách. Vui lòng thông báo trước ít nhất 03 ngày để nhà bếp chuẩn bị thực đơn phù hợp.",
    },
    {
      question: "Nếu trời mưa hoặc bão thì có được hoàn tiền không?",
      answer:
        "Trong trường hợp thời tiết xấu và tour buộc phải hủy, quý khách sẽ được hoàn tiền 100% hoặc đổi sang ngày khác tùy lựa chọn.",
    },
    {
      question: "Du thuyền có cho mang theo rượu/đồ uống riêng không?",
      answer: "Quý khách có thể mang theo nhưng sẽ có phụ phí phục vụ mở rượu theo quy định của tàu (corkage fee).",
    },
    {
      question: "Tôi có thể tổ chức cầu hôn hoặc sinh nhật bất ngờ trên tàu không?",
      answer:
        "Chắc chắn được luôn! Đội ngũ tàu hỗ trợ tận răng từ trang trí, bánh, nến cho tới nhạc nhẹ deep chill. Hãy báo trước để lên kế hoạch thật ngầu nha!",
    },
    {
      question: "Nếu tôi say sóng thì tàu có thuốc hay hỗ trợ gì không?",
      answer:
        "Trên tàu có sẵn thuốc say sóng và đội ngũ y tế hỗ trợ cơ bản. Tuy nhiên, nếu biết mình dễ bị say, quý khách nên uống thuốc trước khi tàu rời bến nhé.",
    },
    {
      question: "Tàu có hoạt động vui chơi buổi tối không hay chỉ ăn rồi đi ngủ?",
      answer:
        "Buổi tối trên tàu siêu chill với nhiều hoạt động như câu mực, xem phim, nhạc sống, karaoke hoặc đơn giản là ngồi boong tàu uống cocktail ngắm sao ✨.",
    },
    {
      question: "Trên tàu có bán trà sữa không?",
      answer: "Tạm thời chưa có nha bạn, nhưng có cocktail chill chill và nước trái cây ép tươi xịn xò nha!",
    },
    {
      question: "Tôi có thể livestream review chuyến đi không hay bị cấm vậy?",
      answer: "Quay review thoải mái luôn mom ơi, miễn là không làm ảnh hưởng tới các hành khách khác là okela 😎.",
    },
  ];
  
  const theme = useTheme();
  //const [openList, setOpenList] = useState([]);//mặc định là đang đóng
  const [openList, setOpenList] = useState(faqData.map((_, index) => index)); // mặc định là đang mở tất cả các mục

  const toggleFAQ = (index) => {
    if (openList.includes(index)) {
      setOpenList(openList.filter((i) => i !== index));
    } else {
      setOpenList([...openList, index]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 10, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "24px",
          boxShadow: theme.shadows[2],
          p: 6,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", color: "text.primary", mb: 4 }}>
          Câu Hỏi Thường Gặp
        </Typography>

        <Box component="img" src="/images/border.jpg" alt="Divider" sx={{ my: 4, width: "20%", display: "block" }} />

        {/* Static Info Boxes */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mb: 6 }}>
          {staticInfo.map((item, i) => (
            <Box
              key={i}
              sx={{
                p: 4,
                border: 1,
                borderColor: "divider",
                borderRadius: "16px",
                bgcolor: "action.hover",
                boxShadow: theme.shadows[1],
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: theme.shadows[2],
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "medium", color: "text.primary", mb: 1 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {item.content}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* FAQ Accordion List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {faqData.map((item, index) => (
            <Box
              key={index}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: "12px",
                bgcolor: "background.default",
                boxShadow: theme.shadows[0],
              }}
            >
              <Box
                onClick={() => toggleFAQ(index)}
                sx={{
                  px: 4,
                  py: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "text.primary" }}>
                  {item.question}
                </Typography>
                <IconButton size="small">
                  <ExpandMoreIcon
                    sx={{
                      transform: openList.includes(index) ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </IconButton>
              </Box>
              <Collapse in={openList.includes(index)}>
                <Box sx={{ px: 4, pb: 3 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.answer}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default FAQ;
