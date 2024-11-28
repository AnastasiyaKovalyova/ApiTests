# Automation Strategy

---

## Introduction

This document outlines the automation testing strategy for functional and non-functional testing of the `/tokens` endpoint of the [Li.Fi](http://Li.Fi) API. The primary goal is to ensure the reliability, performance, and security of the endpoint by validating its behavior under various scenarios, including edge cases. 

Key highlights of this strategy:
- Testing API responses with and without API keys.
- Covering parameter combinations with valid and invalid values.
- Seamless integration with Continuous Integration (CI) workflows using GitHub Actions.
- Comprehensive test reports to ensure maintainability and clarity.

This strategy uses **Playwright** as the primary testing framework, leveraging its capabilities for API testing, blockchain compatibility, and integration with performance testing tools like k6 for advanced load testing.

---

## Scope and Objectives

### Scope

The automation strategy focuses on the comprehensive testing of the `/tokens` endpoint of the LI.FI API. 

**Key areas of focus:**

1. **Functional Testing**
   - Validation of all supported parameters, such as `chainId`, `tokenType`, and `minPriceUSD`.
   - Positive tests for expected responses with valid requests.
   - Negative tests to verify error handling for invalid or missing parameters.
   
2. **Non-Functional Testing**
   - **Performance Testing:** Measure response times under normal and stress conditions.
   - **Security Testing:** Ensure resilience against malicious inputs and vulnerabilities.

3. **Test Variants**
   - Testing with and without API keys to validate rate-limiting and optional authentication behavior.
   - Edge cases, including maximum payload sizes, unsupported values, and unusual input combinations.

4. **Test Artifacts**
   - Automated test scripts covering all functional and non-functional requirements.
   - Detailed reports with clear assertions and validations.

### Objectives

**Primary Objectives:**
1. **Ensure Endpoint Reliability**
   - Validate correct responses for valid inputs.
   - Ensure proper error messages and HTTP status codes for unsupported inputs.

2. **Verify Performance Standards**
   - Assess response time and stability under high traffic.
   - Evaluate scalability to handle varying load conditions.

3. **Deliver a Maintainable Framework**
   - Build a reusable and scalable framework for future testing needs.
   - Generate actionable test reports for stakeholders.

---

## Quality Assurance Approach

### Tools and Technologies
- **TypeScript:** For writing maintainable and robust test scripts.
- **Playwright:** API and UI testing, blockchain-specific validation.
- **Faker.js:** To generate dynamic query parameters for testing.
- **Dotenv:** For securely managing environment variables like API keys.

### Reporting and Metrics

#### Reporter
- **Built-in Playwright Reporter:** Generates clean, easy-to-read reports.
- **Allure Reporting (Optional):** Enhanced reporting for multi-tool frameworks.

#### Metrics Captured
- Test and suite names.
- Execution status and duration.
- Pass/Fail ratios and error messages.
- Request and response details:
  - API endpoint, HTTP method, request/response payloads, status codes.
- Retry information for failed tests.
- Parallel execution details, including the number of workers and test distribution.

---

## Reporting Integration with CI/CD

- GitHub Actions is used to execute tests in parallel during every pull request.
- Test artifacts and reports are generated and uploaded for review.
- Metrics such as test coverage, execution time, and error trends are analyzed for continuous improvement.

---

## Conclusion

This automation strategy ensures thorough testing of the `/tokens` API endpoint while adhering to best practices in quality assurance. By combining functional and non-functional testing, the framework delivers reliability, scalability, and maintainability for present and future testing needs.
