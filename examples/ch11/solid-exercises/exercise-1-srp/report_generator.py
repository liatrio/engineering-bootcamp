"""
ReportGenerator - A class that violates the Single Responsibility Principle.

This class has multiple responsibilities:
1. Data validation
2. Statistics calculation
3. HTML formatting
4. File writing

Your task: Refactor this into separate classes, each with a single responsibility.
"""

from typing import Any


class ReportGenerator:
    """
    A monolithic report generator that handles everything.

    This is an example of BAD design - the class has too many responsibilities.
    Changes to validation, calculation, formatting, or file saving all require
    modifying this single class.
    """

    def __init__(self, output_filename: str = "report.html") -> None:
        self.output_filename = output_filename

    def generate_report(self, data: list[dict[str, Any]]) -> str:
        """
        Generate a report from data.

        This single method does too much:
        - Validates input data
        - Calculates statistics
        - Formats as HTML
        - Writes to file

        Args:
            data: List of dictionaries with 'name' and 'amount' keys

        Returns:
            The generated HTML as a string

        Raises:
            ValueError: If data is invalid
        """
        # Responsibility 1: Data Validation
        if not data:
            raise ValueError("No data provided")

        for i, item in enumerate(data):
            if not isinstance(item, dict):
                raise ValueError(f"Item at index {i} is not a dictionary")
            if "name" not in item:
                raise ValueError(f"Item at index {i} missing 'name' key")
            if "amount" not in item:
                raise ValueError(f"Item at index {i} missing 'amount' key")
            if not isinstance(item["amount"], (int, float)):
                raise ValueError(f"Item at index {i} has non-numeric 'amount'")

        # Responsibility 2: Statistics Calculation
        amounts = [item["amount"] for item in data]
        total = sum(amounts)
        average = total / len(amounts)
        minimum = min(amounts)
        maximum = max(amounts)
        count = len(amounts)

        # Responsibility 3: HTML Formatting
        rows = ""
        for item in data:
            name = item["name"]
            amount = item["amount"]
            rows += f"        <tr><td>{name}</td><td>${amount:.2f}</td></tr>\n"

        html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Financial Report</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; }}
        h1 {{ color: #333; }}
        table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
        th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
        th {{ background-color: #4CAF50; color: white; }}
        tr:nth-child(even) {{ background-color: #f2f2f2; }}
        .summary {{ background-color: #e7f3fe; padding: 20px; border-radius: 5px; }}
        .summary p {{ margin: 5px 0; }}
    </style>
</head>
<body>
    <h1>Financial Report</h1>

    <div class="summary">
        <h2>Summary Statistics</h2>
        <p><strong>Total:</strong> ${total:.2f}</p>
        <p><strong>Average:</strong> ${average:.2f}</p>
        <p><strong>Minimum:</strong> ${minimum:.2f}</p>
        <p><strong>Maximum:</strong> ${maximum:.2f}</p>
        <p><strong>Count:</strong> {count}</p>
    </div>

    <h2>Detailed Data</h2>
    <table>
        <tr>
            <th>Name</th>
            <th>Amount</th>
        </tr>
{rows}    </table>
</body>
</html>"""

        # Responsibility 4: File Writing
        with open(self.output_filename, "w") as f:
            f.write(html)

        return html
