import React, { useEffect, useState } from 'react';
import EmployeeTable from './EmployeeTable';
import { ToastContainer } from 'react-toastify';
import { GetAllEmployees } from '../api';
import AddEmployee from './AddEmployee';

function EmployeeManagementApp() {
    const [showModal, setShowModal] = useState(false);
    const [updateEmpObj, setUpdatEmpObj] = useState(null);
    const [employeesData, setEmployeesData] = useState({
        employees: [],
        pagination: {
            currentPage: 1,
            pageSize: 5,
            totalEmployees: 0,
            totalPages: 0
        }
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const departments = ['All', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Support'];

    const fetchEmployees = async (search = '', department = '', page = 1, limit = 5) => {
        try {
            const data = await GetAllEmployees(search, department, page, limit);
            setEmployeesData(data);
        } catch (err) {
            alert('Error', err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleUpdateEmployee = (empObj) => {
        setShowModal(true);
        setUpdatEmpObj(empObj);
    };

    // Handle search input
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        fetchEmployees(term, selectedDepartment === 'All' ? '' : selectedDepartment, 1, 5);
    };

    // Handle department filter
    const handleDepartmentFilter = (dept) => {
        setSelectedDepartment(dept);
        fetchEmployees(searchTerm, dept === 'All' ? '' : dept, 1, 5);
    };

    return (
        <div className='d-flex flex-column justify-content-center align-items-center w-100 p-3'>
            <h1>Employee Management App</h1>
            <div className='w-100 d-flex justify-content-center'>
                <div className='w-80 border bg-light p-3' style={{ width: '80%' }}>
                    <div className='d-flex justify-content-between mb-3'>
                        <button className='btn btn-primary' onClick={() => setShowModal(true)}>
                            Add
                        </button>
                        <input
                            onChange={handleSearch}
                            type="text"
                            placeholder="Search Employees..."
                            className='form-control w-50'
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="departmentFilter" className="form-label">Filter by Department:</label>
                        <select
                            id="departmentFilter"
                            className="form-select"
                            value={selectedDepartment}
                            onChange={(e) => handleDepartmentFilter(e.target.value)}
                        >
                            {departments.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <EmployeeTable
                        employees={employeesData.employees}
                        pagination={employeesData.pagination}
                        fetchEmployees={fetchEmployees}
                        handleUpdateEmployee={handleUpdateEmployee}
                    />
                    <AddEmployee
                        setShowModal={setShowModal}
                        fetchEmployees={fetchEmployees}
                        showModal={showModal}
                        updateEmpObj={updateEmpObj}
                    />
                </div>
            </div>
            <ToastContainer
                position='top-right'
                autoClose={3000}
                hideProgressBar={false}
            />
        </div>
    );
}

export default EmployeeManagementApp;
