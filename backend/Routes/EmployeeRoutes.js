const { createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployeeById,
    updateEmployeeById
} = require('../Controllers/EmployeeController');
const { cloudinaryFileUploader } = require('../Middlewares/FileUploader');

const routes = require('express').Router();


routes.get('/', getAllEmployees)
routes.get('/:id', getEmployeeById)
routes.delete('/:id', deleteEmployeeById)
routes.put('/:id', cloudinaryFileUploader.single('profileImage'), updateEmployeeById)
routes.post('/', cloudinaryFileUploader.single('profileImage'), createEmployee);

module.exports = routes;