/**
 * API Response formatter utilities
 */

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const sendError = (res, error, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message: error.message || error,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

const sendPaginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      pageSize: limit,
      totalRecords: total,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
};

module.exports = { sendSuccess, sendError, sendPaginatedResponse };
