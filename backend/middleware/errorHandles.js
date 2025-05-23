const errorHandler = (err, req, res, next) => {
    console.error(err.stack); 

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            status: 400,
            message: 'Validation Error',
            error: errors.join(', ')
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; 
        return res.status(409).json({
            status: 409,
            message: 'Duplicate Key Error',
            error: `Giá trị của trường '${field}' đã tồn tại!`
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            status: 400,
            message: 'Invalid ID Format',
            error: `Giá trị ID không hợp lệ: ${err.value}`
        });
    }

    if (err.status === 401) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized',
            error: 'Bạn không có quyền thực hiện hành động này!'
        });
    }

    if (err.status === 403) {
        return res.status(403).json({
            status: 403,
            message: 'Forbidden',
            error: 'Bạn không có quyền truy cập tài nguyên này!'
        });
    }

    if (err.status === 404) {
        return res.status(404).json({
            status: 404,
            message: 'Not Found',
            error: 'Tài nguyên yêu cầu không tồn tại!'
        });
    }

    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
        error: err.stack
    });
};

module.exports = errorHandler;
