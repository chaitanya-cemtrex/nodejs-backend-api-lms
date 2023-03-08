//model, populate

const advancedResults = (model, populate) => {
  return async (req, res, next) => {
    let TeachersQuery = model.find();

    //convert query string to number
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    const total = await model.countDocuments();

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;


    //populate
    if (populate) {
      TeachersQuery = TeachersQuery.populate(populate)
    }

    //filtering / searching
    if (req.query.name) {
      TeachersQuery = model.find({
        name: { $regex: req.query.name, $options: "i" },
      });
    }

    //pagination results
    const pagination = {};

    //add next
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    //add prev
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    //execute query
    const teachers = await TeachersQuery.find().skip(skip).limit(limit);

    res.result = {
      status: "success",
      total,
      pagination,
      message: "Teachers fetched successfully",
      data: teachers,
    }


    next();
  };
};

module.exports = advancedResults;
