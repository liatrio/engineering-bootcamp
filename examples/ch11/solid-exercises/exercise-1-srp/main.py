"""
Demonstration of the ReportGenerator class.

This script shows how the monolithic ReportGenerator works.
Run with: uv run main.py
"""

from report_generator import ReportGenerator


def main() -> None:
    """Generate a sample financial report."""
    # Sample data for the report
    data = [
        {"name": "Q1 Revenue", "amount": 125000.00},
        {"name": "Q2 Revenue", "amount": 142500.50},
        {"name": "Q3 Revenue", "amount": 138750.25},
        {"name": "Q4 Revenue", "amount": 165000.75},
        {"name": "Marketing Expenses", "amount": -45000.00},
        {"name": "Operations Expenses", "amount": -62500.00},
        {"name": "R&D Investment", "amount": -35000.00},
    ]

    # Create the report generator and generate the report
    generator = ReportGenerator(output_filename="financial_report.html")

    print("Generating financial report...")
    html = generator.generate_report(data)

    print("Report generated successfully!")
    print(f"Output file: {generator.output_filename}")
    print(f"HTML length: {len(html)} characters")
    print()
    print("To view the report, open 'financial_report.html' in a web browser.")


if __name__ == "__main__":
    main()
