import React from "react";
import { Container, Typography, Box, useTheme } from "@mui/material";

function RulesAndNotes() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 10, fontFamily: "Roboto, Arial, sans-serif" }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "24px", // Bo tròn mềm mại
          boxShadow: theme.shadows[2],
          p: 6,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", color: "text.primary", mb: 4 }}>
          Quy Định Chung Và Lưu Ý
        </Typography>

        <Box component="img" src="/images/border.jpg" alt="Divider" sx={{ my: 4, width: "20%", display: "block" }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Các card */}
          {[
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
              title: "Giá phòng đã bao gồm",
              content: (
                <ul>
                  <li>Hướng dẫn viên trên tàu</li>
                  <li>Các bữa ăn theo tiêu chuẩn (01 bữa trưa, 01 bữa tối, 01 bữa sáng, 1 bữa trưa nhẹ)</li>
                  <li>Lớp học nấu ăn, Bơi lội (nếu thời tiết cho phép), xem phim, câu mực, xem tivi vệ tinh</li>
                  <li>Phòng tập gym trên tàu</li>
                  <li>Vé tham quan các điểm trong lịch trình (nếu có)</li>
                </ul>
              ),
            },
            {
              title: "Thông tin y tế & dị ứng",
              content:
                "Nếu quý khách có bất kỳ vấn đề y tế đặc biệt nào hoặc dị ứng thực phẩm, vui lòng thông báo trước để chúng tôi có thể chuẩn bị và hỗ trợ chu đáo nhất.",
            },
            {
              title: "Trang phục phù hợp",
              content:
                "Quý khách vui lòng mang theo trang phục phù hợp với các hoạt động ngoài trời như bơi lội, tham quan hang động, hoặc tham gia lớp học nấu ăn. Đặc biệt, buổi tối có thể tổ chức tiệc, khuyến khích mặc đẹp để sống ảo cháy máy!",
            },
            {
              title: "Chính sách trẻ em",
              content: (
                <ul>
                  <li>Trẻ em dưới 6 tuổi miễn phí (ngủ chung giường với bố mẹ)</li>
                  <li>Trẻ từ 6-11 tuổi phụ thu 50% giá người lớn</li>
                  <li>Trẻ từ 12 tuổi trở lên tính như người lớn</li>
                </ul>
              ),
            },
            {
              title: "Hủy đặt phòng",
              content:
                "Những mức giá tốt trên đây đều có điều kiện chung là không được hoàn/hủy và được phép đổi ngày. Quý khách vui lòng liên hệ với chúng tôi để nhận được sự hỗ trợ tốt nhất.",
            },
            {
              title: "Quy định chung khi đi du thuyền",
              content: (
                <ul>
                  <li>Không mang theo chất dễ cháy nổ, vật nuôi hoặc các vật dụng bị cấm.</li>
                  <li>Tuân thủ hướng dẫn của nhân viên tàu trong suốt hành trình.</li>
                  <li>Không xả rác, bảo vệ môi trường biển.</li>
                  <li>Không tự ý rời khỏi khu vực an toàn trên tàu khi chưa được phép.</li>
                  <li>Trẻ em dưới 6 tuổi cần có người lớn đi kèm và giám sát chặt chẽ.</li>
                </ul>
              ),
            },
            {
              title: "Hành vi và ứng xử",
              content:
                "Quý khách vui lòng cư xử lịch sự, tôn trọng nhân viên và các hành khách khác. Những hành vi gây rối, mất trật tự hoặc phá hoại tài sản sẽ bị từ chối phục vụ và xử lý theo quy định pháp luật.",
            },
            {
              title: "Tài sản cá nhân",
              content:
                "Quý khách tự chịu trách nhiệm bảo quản tài sản cá nhân trong suốt chuyến đi. Chúng tôi không chịu trách nhiệm với các trường hợp mất mát do sơ suất cá nhân.",
            },
          ].map(({ title, content }, index) => (
            <Box
              key={index}
              sx={{
                p: 4,
                border: 1,
                borderColor: "divider",
                borderRadius: "16px",
                bgcolor: "action.hover",
                boxShadow: theme.shadows[1],
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: theme.shadows[3],
                  transform: "scale(1.02)",
                  filter: "brightness(1.05)",
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "medium", color: "text.primary", mb: 1 }}>
                {title}
              </Typography>
              <Typography
                variant="body2"
                component={typeof content === "string" ? "p" : "div"}
                sx={{
                  color: "text.secondary",
                  ...(typeof content !== "string" && {
                    pl: 3,
                    "& li": { mb: 0.5, listStyle: "disc" },
                  }),
                }}
              >
                {content}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default RulesAndNotes;
