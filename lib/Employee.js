class Employee {
    constructor(firstName, lastName, role, manager) {
        if (typeof firstName !== "string" || !firstName.trim().length) {
            throw new Error("Expected parameter 'firstName' to be a non-empty string.");
        };

        if (typeof lastName !== "string" || !lastName.trim().length) {
            throw new Error("Expected parameter 'lastName' to be a non-empty string.");
        };

        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.manager = manager;
    }

    getFirstName() {
        return this.firstName
    }

    getLastName() {
        return this.lastName
    }

    getRole() {
        return this.role
    }

    getManager() {
        return this.manager
    }
};

module.exports = Employee;