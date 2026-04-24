"""
Behavior-based tests for the ReportGenerator.

These tests validate the BEHAVIOR/OUTCOMES of report generation:
- Data validation works correctly
- Statistics are calculated accurately
- Files are created properly
- HTML contains expected content

These tests are designed to work regardless of whether the code uses
the original monolithic class or a refactored version with separate classes.
"""

import os
import tempfile
from typing import Any

import pytest

from report_generator import ReportGenerator


class TestDataValidation:
    """Tests for data validation behavior."""

    def test_raises_error_for_empty_data(self) -> None:
        """Report generation should fail with empty data."""
        generator = ReportGenerator()
        with pytest.raises(ValueError, match="No data provided"):
            generator.generate_report([])

    def test_raises_error_for_missing_name_key(self) -> None:
        """Report generation should fail if 'name' key is missing."""
        generator = ReportGenerator()
        data: list[dict[str, Any]] = [{"amount": 100}]
        with pytest.raises(ValueError, match="missing 'name' key"):
            generator.generate_report(data)

    def test_raises_error_for_missing_amount_key(self) -> None:
        """Report generation should fail if 'amount' key is missing."""
        generator = ReportGenerator()
        data: list[dict[str, Any]] = [{"name": "Test"}]
        with pytest.raises(ValueError, match="missing 'amount' key"):
            generator.generate_report(data)

    def test_raises_error_for_non_numeric_amount(self) -> None:
        """Report generation should fail if amount is not numeric."""
        generator = ReportGenerator()
        data: list[dict[str, Any]] = [{"name": "Test", "amount": "not a number"}]
        with pytest.raises(ValueError, match="non-numeric 'amount'"):
            generator.generate_report(data)

    def test_raises_error_for_non_dict_item(self) -> None:
        """Report generation should fail if item is not a dictionary."""
        generator = ReportGenerator()
        data: list[Any] = ["not a dict"]
        with pytest.raises(ValueError, match="not a dictionary"):
            generator.generate_report(data)


class TestStatisticsCalculation:
    """Tests for statistics calculation accuracy."""

    def test_calculates_correct_total(self) -> None:
        """Total should be the sum of all amounts."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [
                {"name": "Item 1", "amount": 100.00},
                {"name": "Item 2", "amount": 200.00},
                {"name": "Item 3", "amount": 300.00},
            ]
            html = generator.generate_report(data)

            # Total should be 600.00
            assert "$600.00" in html
        finally:
            os.unlink(output_file)

    def test_calculates_correct_average(self) -> None:
        """Average should be total divided by count."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [
                {"name": "Item 1", "amount": 100.00},
                {"name": "Item 2", "amount": 200.00},
                {"name": "Item 3", "amount": 300.00},
            ]
            html = generator.generate_report(data)

            # Average should be 200.00
            assert "Average" in html
            # The average 200.00 should appear (as part of summary)
            assert "$200.00" in html
        finally:
            os.unlink(output_file)

    def test_calculates_correct_min_max(self) -> None:
        """Minimum and maximum should be identified correctly."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [
                {"name": "Small", "amount": 50.00},
                {"name": "Medium", "amount": 150.00},
                {"name": "Large", "amount": 500.00},
            ]
            html = generator.generate_report(data)

            assert "Minimum" in html
            assert "Maximum" in html
            assert "$50.00" in html  # Minimum
            assert "$500.00" in html  # Maximum
        finally:
            os.unlink(output_file)

    def test_calculates_correct_count(self) -> None:
        """Count should reflect the number of items."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [
                {"name": "Item 1", "amount": 100.00},
                {"name": "Item 2", "amount": 200.00},
                {"name": "Item 3", "amount": 300.00},
                {"name": "Item 4", "amount": 400.00},
                {"name": "Item 5", "amount": 500.00},
            ]
            html = generator.generate_report(data)

            assert "Count" in html
            assert "Count:</strong> 5</p>" in html  # Count value
        finally:
            os.unlink(output_file)


class TestFileCreation:
    """Tests for file output behavior."""

    def test_creates_output_file(self) -> None:
        """Report generation should create the specified output file."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        # Delete the file first to ensure it's created by the generator
        os.unlink(output_file)

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [{"name": "Test", "amount": 100.00}]
            generator.generate_report(data)

            assert os.path.exists(output_file)
        finally:
            if os.path.exists(output_file):
                os.unlink(output_file)

    def test_file_contains_generated_html(self) -> None:
        """The output file should contain the generated HTML."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [{"name": "Test Item", "amount": 123.45}]
            html = generator.generate_report(data)

            with open(output_file) as f:
                file_content = f.read()

            assert file_content == html
        finally:
            os.unlink(output_file)

    def test_custom_output_filename(self) -> None:
        """Should use the specified output filename."""
        with tempfile.TemporaryDirectory() as tmpdir:
            custom_filename = os.path.join(tmpdir, "custom_report.html")
            generator = ReportGenerator(output_filename=custom_filename)
            data = [{"name": "Test", "amount": 100.00}]
            generator.generate_report(data)

            assert os.path.exists(custom_filename)


class TestHTMLContent:
    """Tests for HTML content structure."""

    def test_html_contains_data_items(self) -> None:
        """Generated HTML should contain all data item names."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [
                {"name": "Revenue", "amount": 1000.00},
                {"name": "Expenses", "amount": -500.00},
            ]
            html = generator.generate_report(data)

            assert "Revenue" in html
            assert "Expenses" in html
        finally:
            os.unlink(output_file)

    def test_html_is_valid_structure(self) -> None:
        """Generated HTML should have proper structure."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [{"name": "Test", "amount": 100.00}]
            html = generator.generate_report(data)

            assert "<!DOCTYPE html>" in html
            assert "<html>" in html
            assert "</html>" in html
            assert "<head>" in html
            assert "</head>" in html
            assert "<body>" in html
            assert "</body>" in html
        finally:
            os.unlink(output_file)

    def test_html_contains_table(self) -> None:
        """Generated HTML should contain a table with data."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [{"name": "Test", "amount": 100.00}]
            html = generator.generate_report(data)

            assert "<table>" in html
            assert "</table>" in html
            assert "<tr>" in html
            assert "<td>" in html
        finally:
            os.unlink(output_file)

    def test_handles_negative_amounts(self) -> None:
        """Should correctly display negative amounts."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [{"name": "Loss", "amount": -250.00}]
            html = generator.generate_report(data)

            assert "$-250.00" in html
        finally:
            os.unlink(output_file)

    def test_handles_decimal_precision(self) -> None:
        """Should format amounts with two decimal places."""
        with tempfile.NamedTemporaryFile(suffix=".html", delete=False) as f:
            output_file = f.name

        try:
            generator = ReportGenerator(output_filename=output_file)
            data = [{"name": "Precise", "amount": 123.456789}]
            html = generator.generate_report(data)

            # Should be rounded to two decimal places
            assert "$123.46" in html
        finally:
            os.unlink(output_file)
