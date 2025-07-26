const Feedback = require("../model/feedback");
const Customer = require("../model/customer");
const mongoose = require("mongoose");

// Get feedback for a specific yacht with pagination and search
exports.getFeedbackByYacht = async (req, res) => {
  try {
    const { yachtId, page = 1, limit = 5, search = "" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(yachtId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid yachtId format",
      });
    }

    const query = { yachtId };
    if (search) {
      query.description = { $regex: search, $options: "i" }; // Case-insensitive search in description
    }

    const total = await Feedback.countDocuments(query);
    const feedback = await Feedback.find(query)
      .populate({
        path: "customerId",
        select: "fullName", // Lấy trường fullName từ customer
        model: "Customer", // Use the model name as a string
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const formattedFeedback = feedback.map((fb) => ({
      id: fb._id.toString(),
      rating: fb.starRating,
      userName: fb.customerId?.fullName || "Anonymous",
      comment: fb.description,
      date: new Date(fb.createdAt).toLocaleDateString("vi-VN"),
    }));

    // Calculate rating distribution and average
    const allFeedback = await Feedback.find({ yachtId }).lean();
    const totalStars = allFeedback.reduce((sum, fb) => sum + fb.starRating, 0);
    const average =
      allFeedback.length > 0 ? (totalStars / allFeedback.length).toFixed(1) : 0;
    const distribution = Array(5)
      .fill(0)
      .map((_, i) => ({
        stars: 5 - i,
        count: allFeedback.filter((fb) => fb.starRating === 5 - i).length,
      }));

    res.status(200).json({
      success: true,
      data: {
        reviews: formattedFeedback,
        ratingData: {
          total,
          average: parseFloat(average),
          distribution,
        },
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching feedback",
      error: error.message,
    });
  }
};

// Submit new feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { starRating, description, yachtId } = req.body;
    // Lấy customerId từ req.user nếu dùng xác thực, hoặc từ req.body nếu không
    const customerId = req.user?.id || req.body.customerId;

    if (
      !mongoose.Types.ObjectId.isValid(yachtId) ||
      !mongoose.Types.ObjectId.isValid(customerId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid yachtId or customerId format",
      });
    }

    if (!starRating || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: starRating, description",
      });
    }

    const feedback = new Feedback({
      starRating,
      description,
      customerId,
      yachtId,
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting feedback",
      error: error.message,
    });
  }
};
