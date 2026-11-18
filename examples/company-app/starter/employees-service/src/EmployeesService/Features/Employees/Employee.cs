namespace EmployeesService.Features.Employees;

/// <summary>An employee row. Plain data: the rules live in EmployeeService.</summary>
public sealed class Employee
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Title { get; set; } = "";
    public string Department { get; set; } = "";

    // Always UTC. Npgsql stores DateTime values of Kind Utc as "timestamp with time zone".
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
