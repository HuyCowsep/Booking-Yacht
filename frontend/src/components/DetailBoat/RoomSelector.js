import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Minus, Plus, X } from "lucide-react";
import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import RoomModal from "./RoomModal";
import CharterBoatModal from "./Booking/CharterBoatModal";
import BookingRoomModal from "./Booking/BookingRoomModal";
import {
  incrementRoomQuantity,
  decrementRoomQuantity,
  setSelectedSchedule,
  setSelectedMaxPeople,
  clearSelection,
  openRoomModal,
  closeRoomModal,
  openBookingModal,
  closeBookingModal,
  openCharterModal,
  closeCharterModal,
} from "../../redux/action";
import { fetchRoomsAndSchedules } from "../../redux/asyncActions";

function RoomSelector({ yachtId, yachtData = {} }) {
  const dispatch = useDispatch();

  // Select state from Redux store
  const {
    rooms,
    schedules,
    selectedSchedule,
    selectedMaxPeople,
    maxPeopleOptions,
    loading,
    error,
  } = useSelector((state) => state.booking);
  const {
    showRoomModal,
    showBookingModal,
    showCharterModal,
    selectedRoomForModal,
  } = useSelector((state) => state.ui.modals);

  // Fetch rooms and schedules when yachtId or selectedSchedule changes
  useEffect(() => {
    if (yachtId) {
      dispatch(fetchRoomsAndSchedules(yachtId, selectedSchedule));
    } else {
      dispatch(clearSelection());
    }
  }, [yachtId, selectedSchedule, dispatch]);

  // Handlers for buttons
  const handleBookNow = () => {
    dispatch(openBookingModal());
  };

  const handleCharterBoat = () => {
    dispatch(openCharterModal());
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
    dispatch(setSelectedSchedule(""));
    dispatch(setSelectedMaxPeople("all"));
  };

  // Handler for opening room modal
  const handleOpenRoomModal = (room) => {
    dispatch(openRoomModal(room));
  };

  // Filter rooms based on selectedMaxPeople
  const filteredRooms =
    selectedMaxPeople === "all"
      ? rooms
      : rooms.filter((room) => room.beds === parseInt(selectedMaxPeople));

  // Get selected rooms for BookingRoomModal
  const getSelectedRooms = () => {
    return rooms.filter((room) => room.quantity > 0);
  };

  // Check if clear button should be shown
  const showClearButton =
    selectedSchedule && rooms.some((room) => room.quantity > 0);

  return (
    <div>
      <h2 className="text-4xl font-bold light:text-gray-900">
        Các loại phòng & giá
      </h2>
      <img src="/images/border.jpg" alt="Divider" className="my-6" />
      <Box
        sx={{
          backgroundImage: "url('../images/background2.jpg')",
          padding: 5,
          borderRadius: "30px",
          boxShadow: 3,
        }}
      >
        {/* Clear Selection Button */}
        {showClearButton && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearSelection}
              className="flex items-center gap-2 capitalize rounded-full px-4 py-2 border bg-gradient-to-t from-slate-50 to-slate-300 text-gray-800 hover:bg-gray-400 hover:shadow-2xl shadow-md"
            >
              <X size={20} />
              <span>Xoá lựa chọn</span>
            </button>
          </div>
        )}

        {/* Schedule Selection */}
        <FormControl
          fullWidth
          variant="outlined"
          margin="normal"
          sx={{ mb: 3 }}
        >
          <InputLabel>Chọn lịch trình</InputLabel>
          <Select
            value={selectedSchedule}
            onChange={(e) => dispatch(setSelectedSchedule(e.target.value))}
            label="Chọn lịch trình"
            disabled={loading || schedules.length === 0}
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
              borderColor: (theme) => theme.palette.divider,
              boxShadow: (theme) => theme.shadows[1],
              color: (theme) => theme.palette.primary.main,
            }}
          >
            {schedules.map((schedule) => (
              <MenuItem key={schedule._id} value={schedule._id}>
                {schedule.durationText}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Max People Selection */}
        {selectedSchedule && (
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Số người tối đa</InputLabel>
            <Select
              value={selectedMaxPeople}
              onChange={(e) => dispatch(setSelectedMaxPeople(e.target.value))}
              label="Số người tối đa"
              disabled={loading || !rooms.length}
              sx={{
                bgcolor: (theme) => theme.palette.background.paper,
                borderColor: (theme) => theme.palette.divider,
                boxShadow: (theme) => theme.shadows[1],
                color: (theme) => theme.palette.primary.main,
              }}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {maxPeopleOptions.map((maxPeople) => (
                <MenuItem key={maxPeople} value={maxPeople}>
                  {maxPeople} {maxPeople > 1 ? "người" : "người"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {loading && <div>Đang tải dữ liệu...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && schedules.length === 0 && yachtId && (
          <div>Không tìm thấy lịch trình cho Yacht ID này</div>
        )}

        {selectedSchedule && (
          <>
            {loading && <div>Đang tải phòng...</div>}
            {!loading && !error && filteredRooms.length === 0 && (
              <div>Không tìm thấy phòng phù hợp với lựa chọn này</div>
            )}
            {filteredRooms.length > 0 && (
              <div className="flex flex-col gap-10">
                <div className="space-y-4">
                  {filteredRooms.map((room) => (
                    <Box
                      key={room.id}
                      className="bg-white p-4 rounded-[30px] shadow-sm flex justify-between items-center border"
                      sx={{
                        bgcolor: (theme) => theme.palette.background.paper,
                        borderColor: (theme) => theme.palette.divider,
                        boxShadow: (theme) => theme.shadows[1],
                      }}
                    >
                      <Box
                        className="flex"
                        sx={{ color: (theme) => theme.palette.text.primary }}
                      >
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-16 h-16 rounded-2xl object-cover"
                        />
                        <div className="ml-3 flex flex-col items-start gap-2">
                          <h3
                            className="font-bold text-base underline cursor-pointer"
                            onClick={() => handleOpenRoomModal(room)}
                          >
                            {room.name}
                          </h3>
                          <div className="flex items-center text-gray-500 gap-4 text-sm">
                            <span className="flex items-center mr-4">
                              <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 mr-1 fill-current"
                              >
                                <path d="M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z" />
                              </svg>
                              {room.area} m²
                            </span>
                            <span className="flex items-center">
                              <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 mr-1 fill-current"
                              >
                                <path d="M19,7H5C3.89,7 3,7.89 3,9V17H5V13H19V17H21V9C21,7.89 20.11,7 19,7M19,11H5V9H19V11Z" />
                              </svg>
                              Tối đa: {room.beds} <User size={15} />
                            </span>
                          </div>
                        </div>
                      </Box>
                      <div className="flex items-center gap-2">
                        <div className="text-teal-600 text-lg font-bold">
                          {room.price.toLocaleString()} đ
                        </div>
                        <div className="text-gray-400 text-xs font-semibold">
                          /khách
                        </div>
                        <Box
                          className="border border-gray-300 rounded-3xl flex items-center"
                          sx={{
                            bgcolor: (theme) => theme.palette.background.paper,
                            borderColor: (theme) => theme.palette.divider,
                            boxShadow: (theme) => theme.shadows[1],
                          }}
                        >
                          <button
                            onClick={() =>
                              dispatch(decrementRoomQuantity(room.id))
                            }
                            className="w-8 h-8 rounded-md flex items-center justify-center"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="mx-3 w-4 text-center">
                            {room.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(incrementRoomQuantity(room.id))
                            }
                            className="w-8 h-8 rounded-md flex items-center justify-center"
                          >
                            <Plus size={16} />
                          </button>
                        </Box>
                      </div>
                    </Box>
                  ))}
                </div>
                <div className="mt-6 rounded-lg p-4 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-2 bg-slate-300 p-3 rounded-2xl">
                    <p className="text-base text-gray-500 font-medium">
                      Tổng tiền:
                    </p>
                    <p className="text-xl text-teal-600 font-bold">
                      {rooms
                        .reduce(
                          (sum, room) => sum + room.price * room.quantity,
                          0
                        )
                        .toLocaleString()}{" "}
                      đ
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCharterBoat}
                      className="bg-white border border-teal-400 text-teal-800 font-semibold rounded-full px-4 py-2 flex items-center hover:bg-teal-800 hover:text-white"
                    >
                      Thuê trọn tàu
                    </button>
                    <button
                      onClick={handleBookNow}
                      className="bg-teal-400 border border-teal-400 text-teal-800 font-semibold rounded-full px-4 py-2 flex items-center hover:bg-teal-800 hover:text-white"
                    >
                      <span className="mr-1">Đặt ngay</span>
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M5 12h14M12 5l7 7-7 7"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Box>
      <RoomModal
        show={showRoomModal}
        room={selectedRoomForModal}
        onClose={() => dispatch(closeRoomModal())}
        onIncrement={(roomId) => dispatch(incrementRoomQuantity(roomId))}
        onDecrement={(roomId) => dispatch(decrementRoomQuantity(roomId))}
      />
      <CharterBoatModal
        show={showCharterModal}
        onClose={() => dispatch(closeCharterModal())}
        yachtData={yachtData}
      />
      <BookingRoomModal
        show={showBookingModal}
        onClose={() => dispatch(closeBookingModal())}
        selectedRooms={getSelectedRooms()}
        yachtData={yachtData}
      />
    </div>
  );
}

export default RoomSelector;
