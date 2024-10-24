const EmployeeModel = require("../Models/EmployeeModel");

const createEmployee = async (req, res) => {
    try {
        const body = req.body;
        const profileImage = req.file ? req.file.path : null;
        body.profileImage = profileImage; // Set to empty string if no file is provided

        // Validate required fields
        if (!body.name || !body.email || !body.phone || !body.department || !body.salary) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        
        // Validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(body.email)) {
            return res.status(400).json({ message: 'Invalid email format', success: false });
        }

        // Validate phone number format
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(body.phone)) {
            return res.status(400).json({ message: 'Phone number must be a 10-digit number', success: false });
        }

        // Validate salary
        if (isNaN(body.salary)) {
            return res.status(400).json({ message: 'Salary must be a number', success: false });
        }

        // Create the employee record
        const emp = new EmployeeModel(body);
        await emp.save();
        res.status(201).json({ message: 'Employee Created', success: true });

    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({ message: `${field} already exists`, success: false });
        }
        res.status(500).json({ message: 'Internal Server Error', success: false, error: err.message });
    }
};


const getAllEmployees = async (req, res) => {
    try {
        let { page, limit, search, department } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        // Filtering and search criteria
        let searchCriteria = {};
        if (search) {
            searchCriteria.name = { $regex: search, $options: 'i' }; // case-insensitive search by name
        }
        if (department && department !== 'All') {
            searchCriteria.department = department;
        }

        const totalEmployees = await EmployeeModel.countDocuments(searchCriteria);
        const employees = await EmployeeModel.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort({ updatedAt: -1 });

        const totalPages = Math.ceil(totalEmployees / limit);

        res.status(200).json({
            message: 'Employees retrieved successfully',
            success: true,
            data: {
                employees,
                pagination: {
                    totalEmployees,
                    currentPage: page,
                    totalPages,
                    pageSize: limit
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err.message
        });
    }
};


const getEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;
        const emp = await EmployeeModel.findById(id);

        if (!emp) {
            return res.status(404).json({
                message: 'Employee not found',
                success: false
            });
        }

        res.status(200).json({
            message: 'Employee Details',
            success: true,
            data: emp
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err.message
        });
    }
};

const deleteEmployeeById = async (req, res) => {
    try {
        const id = req.params.id;
        const emp = await EmployeeModel.findByIdAndDelete(id);

        if (!emp) {
            return res.status(404).json({
                message: 'Employee not found',
                success: false
            });
        }

        res.status(200).json({
            message: 'Employee Deleted Successfully',
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err.message
        });
    }
};

const updateEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, department, salary } = req.body;
        const updateData = { name, email, phone, department, salary, updatedAt: new Date() };

        // Update profile image if provided
        if (req.file) {
            updateData.profileImage = req.file.path;
        }

        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found', success: false });
        }

        res.status(200).json({ message: 'Employee Updated Successfully', success: true, data: updatedEmployee });
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({ message: `${field} already exists`, success: false });
        }
        res.status(500).json({ message: 'Internal Server Error', success: false, error: err.message });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployeeById,
    updateEmployeeById
};
