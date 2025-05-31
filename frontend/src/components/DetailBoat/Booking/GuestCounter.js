import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus } from "lucide-react";
import { Box } from "@mui/material";
import {
  setGuestCounterOpen,
  updateAdults,
  updateChildren,
} from "../../../redux/action";

const GuestCounter = () => {
  const dispatch = useDispatch();
  const {
    guestCounter: { isOpen, adults, children },
    bookingForm: { guestCount },
  } = useSelector((state) => state.booking);

  return (
    <div className="relative">
      <Box
        onClick={() => dispatch(setGuestCounterOpen(!isOpen))}
        className="w-full p-4 border border-gray-300 bg-white cursor-pointer flex justify-between rounded-[32px] items-center hover:border-teal-400 transition-colors"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          borderColor: (theme) => theme.palette.divider,
          boxShadow: (theme) => theme.shadows[1],
          color: (theme) => theme.palette.text.primary,
          "&:hover": {
            borderColor: (theme) => theme.palette.primary.main,
          },
        }}
      >
        <span className="text-gray-700">{guestCount}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Box>
      {isOpen && (
        <Box
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-3xl shadow-lg z-50 p-4"
          sx={{
            bgcolor: (theme) => theme.palette.background.paper,
            borderColor: (theme) => theme.palette.divider,
            boxShadow: (theme) => theme.shadows[1],
            color: (theme) => theme.palette.text.primary,
            "&:hover": {
              borderColor: (theme) => theme.palette.primary.main,
            },
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-700 font-medium">Người lớn</span>
            <div className="flex items-center">
              <button
                onClick={() => dispatch(updateAdults(-1))}
                disabled={adults <= 1}
                className="w-8 h-8 rounded-l-full border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="mx-3 w-4 text-center">{adults}</span>
              <button
                onClick={() => dispatch(updateAdults(1))}
                className="w-8 h-8 rounded-r-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-700 font-medium">Trẻ em</span>
            <div className="flex items-center">
              <button
                onClick={() => dispatch(updateChildren(-1))}
                disabled={children <= 0}
                className="w-8 h-8 rounded-l-full border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="mx-3 w-4 text-center">{children}</span>
              <button
                onClick={() => dispatch(updateChildren(1))}
                className="w-8 h-8 rounded-r-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <hr />
          <button
            onClick={() => dispatch(setGuestCounterOpen(false))}
            className="w-full py-3 mt-3 bg-teal-400 text-white rounded-3xl font-medium hover:bg-teal-500 transition-colors disabled:opacity-50"
          >
            <p className="mx-auto">Áp dụng</p>
          </button>
        </Box>
      )}
    </div>
  );
};

export default GuestCounter;
