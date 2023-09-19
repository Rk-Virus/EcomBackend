const Offer = require('../models/Offer')
// const Order = require('../models/Order')
const User = require('../models/User')

// // ===========Create Offer===================

const createOffer = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
      return res.status(400).json({ msg: "one or more field requird" });
    }

    const offer = new Offer({
      ...req.body
    });

    const resp = await offer.save();
    res.status(200).json({ msg: "success", response: resp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "something went wrong" });
  }
};

// ===========Add a new Employee===================
const addEmployee = async (req, res) => {
  const { name, email, password, phoneNo, address } = req.body;
  if (!name || !email || !password || !phoneNo || !address) {
    return res.status(400).json({ msg: "one or more field required" });
  }
  try {
    const foundEmp = await User.findOne({$or : [{email}, {phoneNo}]})
    if(foundEmp) return res.status(400).json({msg : "Employee already exist"})
    const employee = new User({
      userType: "employee",
      ...req.body
    });
    const resp = await employee.save();
    res.status(200).json({ msg: "success", response: resp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "something went wrong" });
  }
};

// // ===========Approve an Order===================
// const approveOrder = async (req, res) => {
//   const { orderId, employeeId } = req.body;
//   if (!orderId || !employeeId)
//     return res.status(400).json({ msg: "orderId and EmployeeId required" });

//   try {
//     const order = await Order.findById(orderId);
//     const employee = await User.findOne({ userId: employeeId });
//     if (!employee) return res.status(400).json({ msg: "employee not found" });
//     order.employeeAllocated = employee._id;
//     const resp = await order.save();
//     res.status(200).json({ msg: "success", response: resp });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "something went wrong", error: err });
//   }
// };

// // ===========Get all Employees===================

// const getAllEmployees = async (req, res) => {
//   try {
//     const employees = await User.find({ userType: "employee" });
//     res.status(200).json({ msg: "success", response: employees });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "something went wrong", error: err });
//   }
// };

// const getEmployeeSchedule = async (req, res) => {
//   try {
//     const foundOrders = await Order.find({
//       employeeAllocated: req.params.empId,
//       endsAt: { $gt: Date.now() },
//     })
//       .populate("offer")
//       .populate("customer", "-password -refferalId -bookings -userType")
//       .select("-employeeAllocated")
//       .sort({startsAt : 'asc'})

//     res.status(200).json({ msg: "success", response: foundOrders });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "something went wrong", error: err });
//   }
// };
// // ===========Get all Orders===================

// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("offer")
//       .populate("customer", "-password -refferalId -bookings -userType")
//       .sort({startsAt : 'asc'})

//     res.status(200).json({ msg: "success", response: orders });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "something went wrong", error: err.message });
//   }
// };

// const getSingleOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.orderId)
//       .populate("customer", "-password")
//       .populate("employeeAllocated", "userId phoneNo name profilePic")
//       .populate("offer");
//     if (!order) return res.status(404).json({ msg: "Order not found" });

//     let orderStatus;
//     if (order.endsAt > Date.now()) {
//       orderStatus = "ACTIVE";
//     } else {
//       orderStatus = "EXPIRED";
//     }
//     res.status(200).json({ msg: "success", response: { order, orderStatus } });
//   } catch (error) {
//     console.log(err);
//     res.status(500).json({ msg: "something went wrong", error: err });
//   }
// };

module.exports = {
  addEmployee,
  createOffer,
  // approveOrder,
  // getAllEmployees,
  // getEmployeeSchedule,
  // getAllOrders,
  // getSingleOrder,
};
