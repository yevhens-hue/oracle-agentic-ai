# Test-Driven Development (TDD) Mandatory Standard

## Core Rule
All feature development, bug fixes, and refactoring MUST strictly adhere to the **Test-Driven Development (TDD) Red-Green-Refactor Loop**.

## Workflow
1. **Vertical Slicing (One test → One implementation)**:
   - NEVER write all tests first or all code first.
   - Write **ONE RED test** for a single user-facing behavior.
   - Run pytest / unit tests to confirm it fails (**RED**).
   - Write the **minimal implementation code** to make the test pass (**GREEN**).
   - Run pytest / unit tests to confirm it passes (**GREEN**).
   - Refactor if necessary while staying GREEN.
2. **Behavior Over Implementation**:
   - Test through public APIs and interfaces, not private internals.
   - Tests must describe what capability exists and survive internal refactorings.
3. **Verification Requirement**:
   - Never declare success without running `.venv/bin/pytest tests/test_api.py` and `npm run build`.
