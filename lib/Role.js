class Role {
    constructor(title, salary, department) {
        if (typeof title !== "string" || !title.trim().length) {
            throw new Error("Expected parameter 'title' to be a non-empty string.");
        };

        if (typeof salary !== "string" || !salary.trim().length) {
            throw new Error("Expected parameter 'salary' to be a non-empty string.");
        };

        this.title = title;
        this.salary = salary;
        this.department = department;
    }

    getTitle() {
        return this.title
    }

    getSalary() {
        return this.salary
    }

    getDepartment() {
        return this.department
    }
};

module.exports = Role;