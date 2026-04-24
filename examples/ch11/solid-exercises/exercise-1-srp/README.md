# Exercise 1: Single Responsibility Principle (SRP)

> "A class should have only one reason to change." - Robert C. Martin

## Overview

This exercise demonstrates a class that **violates** the Single Responsibility Principle. Your task is to refactor it into multiple classes, each with a single, focused responsibility.

## The Problem

The `ReportGenerator` class in `report_generator.py` currently handles **four different responsibilities**:

1. **Data Validation** - Checking if input data is valid
2. **Statistics Calculation** - Computing totals, averages, min/max
3. **HTML Formatting** - Converting data into HTML markup
4. **File Writing** - Saving the output to disk

This design has several problems:
- Changes to validation rules require modifying the entire class
- You can't test the calculation logic without file I/O
- Switching from HTML to JSON output requires changing the same class
- The class violates the "one reason to change" principle

## Setup

```bash
# Navigate to this directory
cd examples/ch11/solid-exercises/exercise-1-srp

# Install dependencies
uv sync

# Run the demo to see the current implementation
uv run main.py

# Run the tests to verify behavior
uv run --extra dev pytest

# Run type checking
uv run --extra dev mypy .

# Run linting
uv run --extra dev ruff check .
```

## Your Task

Refactor `report_generator.py` to follow SRP by creating separate classes:

### Suggested Refactoring

1. **`DataValidator`** - Handles all validation logic
   - `validate(data)` - Validates input data, raises ValueError if invalid

2. **`StatisticsCalculator`** - Handles calculations
   - `calculate(data)` - Returns a dict with total, average, min, max, count

3. **`HTMLFormatter`** - Handles HTML generation
   - `format(data, statistics)` - Returns HTML string

4. **`FileWriter`** - Handles file output
   - `write(content, filename)` - Writes content to file

5. **`ReportService`** - Coordinates the above classes
   - `generate_report(data, filename)` - Orchestrates the workflow

## Success Criteria

After refactoring:
- Each class should have exactly **one reason to change**
- All existing tests should still pass (`uv run --extra dev pytest`)
- The `main.py` demo should still work
- Type checking passes (`uv run --extra dev mypy .`)
- Linting passes (`uv run --extra dev ruff check .`)

## Learning Objectives

After completing this exercise, you should understand:

1. How to identify multiple responsibilities in a single class
2. How to extract responsibilities into separate, focused classes
3. How SRP makes code easier to test, maintain, and extend
4. The difference between a "God class" and well-designed collaborating classes

## Code Smells to Watch For

- Classes with more than 5-7 methods
- Methods with multiple levels of abstraction
- Classes that are hard to name without using "and" or "Manager"
- Hidden dependencies (imports inside methods)
- Methods longer than 20-30 lines

## Hints

- Start by identifying the boundaries between responsibilities
- Create one class at a time, moving related code
- The tests validate behavior, not implementation, so they should pass with your refactored code
- Consider using dependency injection for the coordinator class
