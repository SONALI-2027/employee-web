package com.employee.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.employee.entity.Employee;
import com.employee.service.EmployeeService;

@CrossOrigin(maxAge = 3360)
@RestController
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<Employee> getEmployeeById(
            @PathVariable Long employeeId) {

        Employee employee = employeeService.getEmployeeById(employeeId);

        if (employee == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(employee);
    }

    @PostMapping("/employees")
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {

        System.out.println("========== EMPLOYEE DATA ==========");
        System.out.println("Name    : " + employee.getName());
        System.out.println("Manager : " + employee.getManager());
        System.out.println("Salary  : " + employee.getSalary());

        return ResponseEntity.ok(employeeService.addEmployee(employee));
    }
    
    @PatchMapping("/employees/{employeeId}")
    public ResponseEntity<Employee> updateEmployee(
            @RequestBody Employee employee,
            @PathVariable Long employeeId) {

        Employee empObj = employeeService.getEmployeeById(employeeId);

        if (empObj == null) {
            return ResponseEntity.notFound().build();
        }

        empObj.setName(employee.getName());
        empObj.setManager(employee.getManager());
        empObj.setSalary(employee.getSalary());

        return ResponseEntity.ok(
                employeeService.updateEmployee(empObj));
    }

    @DeleteMapping("/employees/{employeeId}")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable Long employeeId) {

        Employee empObj = employeeService.getEmployeeById(employeeId);

        if (empObj == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                employeeService.deleteEmployee(empObj));
    }
}