const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Validation function for phone number (10 digits)
const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};

// Validation function for email
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

// Validation function for profile image
const validateProfileImage = (profileImage) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    return allowedExtensions.test(profileImage);
};

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: validateEmail,
            message: 'Invalid email format'
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        validate: {
            validator: validatePhoneNumber,
            message: 'Phone number must be a valid 10-digit number'
        }
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    profileImage: {
        type: String,
        validate: {
            validator: function (value) {
                return !value || validateProfileImage(value); // Validate only if the value is present
            },
            message: 'Profile image must be a .jpg, .jpeg, or .png file'
        }
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required'],
        min: [0, 'Salary cannot be negative']
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Pre-save hook to handle unique email/phone check without querying in the logic
EmployeeSchema.pre('save', async function (next) {
    if (!this.isModified('email') && !this.isModified('phone')) {
        return next();
    }
    
    try {
        const existingEmail = await mongoose.models.employees.findOne({ email: this.email });
        const existingPhone = await mongoose.models.employees.findOne({ phone: this.phone });
        
        if (existingEmail) {
            throw new Error('Email already exists');
        }
        if (existingPhone) {
            throw new Error('Phone number already exists');
        }

        next();
    } catch (error) {
        next(error);
    }
});

const EmployeeModel = mongoose.model('employees', EmployeeSchema);
module.exports = EmployeeModel;
