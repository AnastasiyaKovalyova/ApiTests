# Automation Framework for LI.FI API Testing

## Table of Contents
- [Introduction](#introduction)
- [Key Features](#key-features)
- [Pre-requisites](#pre-requisites)
- [Setup Instructions](#setup-instructions)
- [Running the Tests](#running-the-tests)
- [Test Coverage](#test-coverage)

---

## Introduction

This repository contains the automation framework designed to test the `/tokens` endpoint of the LI.FI API. The framework is built to ensure functional correctness, performance, and security compliance, and it seamlessly integrates into Continuous Integration/Continuous Deployment (CI/CD) pipelines.

The framework uses **Playwright** for API testing, supporting parallel test execution, and ensuring test maintainability and reusability. This testing suite covers various scenarios, including positive, negative, edge cases, performance, and security validation.

---

## Key Features

- **Comprehensive Test Coverage**: Covers positive, negative, and edge-case scenarios.
- **Functional and Non-Functional Testing**:
  - Validates API responses for various parameter combinations.
  - Tests for performance and security vulnerabilities.
- **Parallel Execution**: Speeds up test runs using Playwright's parallel execution.
- **Maintainability**: Easy to extend and modify for future API endpoints.
- **Detailed Reporting**: Generates actionable test reports to track progress and debug failures.

---

## Pre-requisites

Ensure the following are installed on your machine:

- **Node.js (>=16.x)**: [Download Node.js](https://nodejs.org)
- **Playwright**: Installed as part of the project dependencies.
- **Git**: For version control.
- A valid **API Key** for the LI.FI API.

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/lifi-api-testing.git
cd lifi-api-testing
```

### 2. Install Dependencies
```
npm install
```

### 3. Set Up Environment Variables
Create a .env file: Copy the .env.example file to .env and fill in the required values.
```
cp .env.example .env
```
Update .env file:
- Add your BASE_URL and X_LIFI_API_KEY as shown in .env.example.

### 4. Verify Installation
```
npx playwright install
```

## Running the Tests

### Run All Tests
```
npx playwright test
```

### Run Specific Test Files
```
npx playwright test tests/API/tokens/positive.spec.ts
```

### Run Tests in Parallel
```
npx playwright test --workers=4
```

### Run Tests with Debugging
```
npx playwright test --headed --debug
```

## Test Coverage

To see a list of all test cases covered within this automation go to /docs/TestCoverage.md file
To see the Test Plan for this task go to /docs/TestPlan.md

Please note that the performance tests are not added in this framework implementation!