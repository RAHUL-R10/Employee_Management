import React from 'react';
import { Link } from 'react-router-dom';
import { DeleteEmployeeById } from '../api';
import { notify } from '../utils';

function EmployeeTable({
    employees, pagination, fetchEmployees, handleUpdateEmployee
}) {
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Actions'];
    const { currentPage, totalPages } = pagination;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            fetchEmployees('', '', currentPage + 1, 5);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            fetchEmployees('', '', currentPage - 1, 5);
        }
    };

    const handlePageClick = (pageNum) => {
        fetchEmployees('', '', pageNum, 5);
    };

    const handleDeleteEmployee = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await DeleteEmployeeById(id);
                if (response.success) {
                    notify('Employee deleted successfully', 'success');
                    fetchEmployees(); // Refresh the employee list
                } else {
                    notify(response.message, 'error');
                }
            } catch (err) {
                notify('Error deleting employee', 'error');
            }
        }
    };

    const TableRow = ({ employee }) => (
        <tr>
            <td>
                <Link to={`/employee/${employee._id}`} className='text-decoration-none'>
                    {employee.name}
                </Link>
            </td>
            <td>{employee.email}</td>
            <td>{employee.phone}</td>
            <td>{employee.department}</td>
            <td>
                <i
                    className='bi bi-pencil-fill text-warning md-4 me-3'
                    role='button'
                    onClick={() => handleUpdateEmployee(employee)}
                    title="Edit"
                ></i>
                <i
                    className='bi bi-trash-fill text-danger md-4'
                    role='button'
                    onClick={() => handleDeleteEmployee(employee._id)}
                ></i>
            </td>
        </tr>
    );

    // Generate pagination numbers
    const renderPageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    className={`btn btn-outline-primary ${i === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <>
            {/* Employee Table */}
            <table className='table table-striped'>
                <thead>
                    <tr>
                        {headers.map((header, i) => (
                            <th key={i}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employees.length > 0 ? (
                        employees.map((emp) => (
                            <TableRow key={emp._id} employee={emp} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length} className="text-center">No employees found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center my-3">
                <span className="badge bg-primary">Page {currentPage} of {totalPages}</span>
                <div>
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {renderPageNumbers()}
                    <button
                        className="btn btn-outline-primary ms-2"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}

export default EmployeeTable;
