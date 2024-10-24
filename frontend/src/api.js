const BASE_URL = 'http://localhost:8080';

export const GetAllEmployees = async (search = '', department = '', page = 1, limit = 5) => {
    const url = `${BASE_URL}/api/employees?search=${search}&department=${department}&page=${page}&limit=${limit}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const result = await fetch(url, options);
        const { data } = await result.json();
        return data;
    } catch (err) {
        return err;
    }
};

export const GetEmployeeDetailsById = async (id) => {
    const url = `${BASE_URL}/api/employees/${id}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const result = await fetch(url, options);
        const { data } = await result.json();
        console.log(data);
        return data;
    } catch (err) {
        return err;
    }
};

export const DeleteEmployeeById = async (id) => {
    const url = `${BASE_URL}/api/employees/${id}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const result = await fetch(url, options);
        const data = await result.json();
        console.log(data);
        return data;
    } catch (err) {
        return err;
    }
};

export const CreateEmployee = async (empObj) => {
    const url = `${BASE_URL}/api/employees`;

    // Create a FormData object
    const formData = new FormData();

    // Append each field to FormData
    for (const key in empObj) {
        // Append profileImage only if it's a valid File
        if (key === 'profileImage' && empObj[key] instanceof File) {
            formData.append(key, empObj[key]);
        } else if (empObj[key] !== null && empObj[key] !== undefined) {
            // Append non-file fields, skip if null or undefined
            formData.append(key, empObj[key].toString());
        }
    }

    const options = {
        method: 'POST',
        body: formData
    };

    try {
        const result = await fetch(url, options);
        const data = await result.json();

        // Handle the case when the API returns an error
        if (!result.ok) {
            console.error('Error:', data.message);
            return { success: false, message: data.message };
        }

        return data;
    } catch (err) {
        console.error('Fetch error:', err);
        return { success: false, message: 'Request failed', error: err.message };
    }
};

export const UpdateEmployeeById = async (empObj, id) => {
    const url = `${BASE_URL}/api/employees/${id}`;
    console.log('url ', url);

    // Create a FormData object
    const formData = new FormData();

    // Append all fields to the FormData object
    for (const key in empObj) {
        // Append profileImage only if it's a valid File
        if (key === 'profileImage' && empObj[key] instanceof File) {
            formData.append(key, empObj[key]);
        } else if (empObj[key] !== null && empObj[key] !== undefined) {
            // Append non-file fields, skip if null or undefined
            formData.append(key, empObj[key].toString());
        }
    }

    // FormData handles the headers and content type
    const options = {
        method: 'PUT',
        body: formData
    };
    try {
        const result = await fetch(url, options);
        const data = await result.json();
        console.log('<---update--> ', data);
        
        // Handle the case when the API returns an error
        if (!result.ok) {
            console.error('Error:', data.message);
            return { success: false, message: data.message };
        }

        return data;
    } catch (err) {
        console.error('Fetch error:', err);
        return { success: false, message: 'Request failed', error: err.message };
    }
};
