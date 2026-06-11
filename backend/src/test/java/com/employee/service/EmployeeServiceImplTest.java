package com.employee.service;
import com.employee.service.impl.EmployeeServiceImpl;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.employee.entity.Employee;
import com.employee.repository.EmployeeRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class EmployeeServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private Employee employee;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        employee = new Employee();
        employee.setEmployeeId(1L);
        employee.setName("Sonali");
        employee.setManager("Rahul");
        employee.setSalary("50000");
    }

    @Test
    void testGetAllEmployees() {

        when(employeeRepository.findAll())
                .thenReturn(Arrays.asList(employee));

        List<Employee> employees =
                employeeService.getAllEmployees();

        assertEquals(1, employees.size());
        assertEquals("Sonali",
                employees.get(0).getName());

        verify(employeeRepository,
                times(1)).findAll();
    }

    @Test
    void testGetEmployeeById() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        Employee foundEmployee =
                employeeService.getEmployeeById(1L);

        assertNotNull(foundEmployee);
        assertEquals("Sonali",
                foundEmployee.getName());

        verify(employeeRepository,
                times(1)).findById(1L);
    }

    @Test
    void testAddEmployee() {

        when(employeeRepository.save(employee))
                .thenReturn(employee);

        Employee savedEmployee =
                employeeService.addEmployee(employee);

        assertNotNull(savedEmployee);
        assertEquals("Sonali",
                savedEmployee.getName());

        verify(employeeRepository,
                times(1)).save(employee);
    }

    @Test
    void testUpdateEmployee() {

        employee.setSalary("70000");

        when(employeeRepository.save(employee))
                .thenReturn(employee);

        Employee updatedEmployee =
                employeeService.updateEmployee(employee);

        assertEquals("70000",
                updatedEmployee.getSalary());

        verify(employeeRepository,
                times(1)).save(employee);
    }

    @Test
    void testDeleteEmployee() {

        doNothing()
                .when(employeeRepository)
                .delete(employee);

        String response =
                employeeService.deleteEmployee(employee);

        assertTrue(response.contains("deleted"));

        verify(employeeRepository,
                times(1)).delete(employee);
    }
}