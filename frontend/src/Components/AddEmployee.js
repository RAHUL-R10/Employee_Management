import React, { useState, useEffect } from 'react';
import { notify } from '../utils';
import { CreateEmployee, UpdateEmployeeById } from '../api';

function AddEmployee({ showModal, setShowModal, fetchEmployees, updateEmpObj }) {
    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        salary: '',
        profileImage: null,
        _id: null // Added ID for update mode
    });
    const [updateMode, setUpdateMode] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageConfirmed, setImageConfirmed] = useState(false);
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Support'];

    useEffect(() => {
        if (updateEmpObj) {
            setEmployee(updateEmpObj);
            setUpdateMode(true);
            if (updateEmpObj.profileImage) {
                setPreviewImage(updateEmpObj.profileImage);
                setImageConfirmed(true);
            }
        } else {
            resetEmployeeStates();
        }
    }, [updateEmpObj]);

    const resetEmployeeStates = () => {
        setEmployee({
            name: '',
            email: '',
            phone: '',
            department: '',
            salary: '',
            profileImage: null,
            _id: null // Reset ID as well
        });
        setPreviewImage(null);
        setImageConfirmed(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Validate the file type
        if (file && !['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
            notify('Profile image must be PNG, JPG, or JPEG', 'error');
            return;
        }

        setEmployee({ ...employee, profileImage: file });
        setPreviewImage(file ? URL.createObjectURL(file) : null);
        setImageConfirmed(false); // Reset confirmation since a new image is selected
    };

    const handleChangeImage = () => {
        setEmployee({ ...employee, profileImage: null });
        setPreviewImage(null);
        setImageConfirmed(false); // Reset confirmation
    };

    const handleConfirmImage = () => {
        setImageConfirmed(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setUpdateMode(false);
        resetEmployeeStates();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!/^\d{10}$/.test(employee.phone)) {
            notify('Phone number must be 10 digits', 'error');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(employee.email)) {
            notify('Invalid email format', 'error');
            return;
        }

        if (isNaN(employee.salary) || employee.salary <= 0) {
            notify('Salary must be a positive number', 'error');
            return;
        }

        // Check if the image is confirmed if one is uploaded
        if (employee.profileImage && !imageConfirmed) {
            notify('Please confirm the profile image', 'error');
            return;
        }

        try {
            let response;
            if (updateMode) {
                response = await UpdateEmployeeById(employee, employee._id); 
            } else {
                response = await CreateEmployee(employee);
            }

            const { success, message } = response;

            if (success) {
                notify(message, 'success');
                handleClose();
                fetchEmployees();
            } else {
                notify(message, 'error');
            }
        } catch (err) {
            // Enhanced error handling
            const errorMessage = err.message || 'Internal Server Error';
            notify('Error: ' + errorMessage, 'error');
        }
    };

    return (
        <div className={`modal ${showModal ? 'd-block' : ''}`} tabIndex={-1} role='dialog' style={{ display: showModal ? 'block' : 'none' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className='modal-header'>
                        <h5>{updateMode ? 'Update Employee' : 'Add Employee'}</h5>
                        <button type='button' className='btn-close' onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={employee.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={employee.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={employee.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Department</label>
                                <select
                                    className="form-select"
                                    name="department"
                                    value={employee.department}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept, index) => (
                                        <option key={index} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Salary</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="salary"
                                    value={employee.salary}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Profile Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="profileImage"
                                    accept="image/png, image/jpg, image/jpeg"
                                    onChange={handleFileChange}
                                />
                                {previewImage && (
                                    <div className="mt-2">
                                        <img src={previewImage} alt="Profile Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                                        <div className="mt-2">
                                            <button type="button" className="btn btn-secondary me-2" onClick={handleConfirmImage} disabled={imageConfirmed}>
                                                {imageConfirmed ? 'Image Confirmed' : 'Confirm Image'}
                                            </button>
                                            <button type="button" className="btn btn-danger" onClick={handleChangeImage}>
                                                Change Image
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary">
                                {updateMode ? 'Update' : 'Save'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEmployee;
