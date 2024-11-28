# Automated Test Coverage

This document outlines the test cases covered in the automation framework for the `/tokens` API endpoint. Each test ensures functionality, robustness, and compliance with expected behavior.

---

## Functional Tests

### TOKENS_01
**Description:** GET request with no parameters.  
**Expected Outcome:**  
- Response contains tokens from all supported chains and chain types.  
- Each token has all required fields present.

---

### TOKENS_02
**Description:** GET request with all parameters provided (valid values only).  
**Expected Outcome:**  
- Response contains tokens from specified chains and chain types.  
- Each token has all required fields present.

---

### TOKENS_03
**Description:** GET request for all valid chainTypes in a single request.  
**Expected Outcome:**  
- Response includes tokens from all provided chainTypes.  
- Each token has all required fields present.

---

### TOKENS_04
**Description:** GET request for a single supported chainType:  
- EVM  
- SVM  
- UTXO  
**Expected Outcome:**  
- Response contains tokens only from the specified chainType.  
- Each token has all required fields present.

---

### TOKENS_05
**Description:** GET request for all valid chains in a single request.  
**Expected Outcome:**  
- Response contains tokens only from the specified chains.  
- Each token has all required fields present.

---

### TOKENS_06
**Description:** GET request for a single supported chain.  
**Expected Outcome:**  
- Response contains tokens only from the provided chain.  
- Each token has all required fields present.

---

### TOKENS_07
**Description:** GET request with valid `minPriceUSD` values:  
- Minimum allowed value  
- Maximum allowed value  
- Value where no tokens should be returned  
**Expected Outcome:**  
- Response includes tokens priced at or above the specified `minPriceUSD` value.  
- Rounding is validated.

---

### TOKENS_08
**Description:** GET request with a valid API Key.  
**Expected Outcome:**  
- Requests with a valid API key bypass rate limits.  
- Requests without a key hit the rate limit.

---

### TOKENS_09
**Description:** GET request with duplicate `chainTypes` parameters.  
**Expected Outcome:**  
- Duplicates are removed.  
- Response includes data for unique `chainTypes`.

---

### TOKENS_10
**Description:** GET request with duplicate `chains` parameters.  
**Expected Outcome:**  
- Duplicates are removed.  
- Response includes data for unique chains.

---

## Edge Case Tests

### TOKENS_11
**Description:** GET request with extremely long strings in query parameters.  
**Expected Outcome:**  
- Invalid long strings are ignored.  
- Response is processed for valid parameters.

---

### TOKENS_12
**Description:** Validate maximum decimal precision for `minPriceUSD=123.456789123456789`.  
**Expected Outcome:**  
- Framework validates precision and truncation.

---

### TOKENS_13
**Description:** GET request with maximum valid chains and chainTypes parameters.  
**Expected Outcome:**  
- Response includes tokens from all supported chains and chainTypes.  
- Each token has all required fields present.

---

## Security Tests

### TOKENS_14
**Description:** SQL Injection Test: `chains=1;DROP TABLE tokens`.  
**Expected Outcome:**  
- Request fails with Response Code = 400.  
- No data is manipulated or compromised.

---

### TOKENS_15
**Description:** XSS Injection Test: `chainTypes=<script>alert(1)</script>`.  
**Expected Outcome:**  
- Request fails with Response Code = 400.  
- Input sanitization prevents code execution.

---

## Validation Tests

### TOKENS_16-22
**Descriptions:** GET requests with unsupported or invalid `chains` or `chainTypes` parameters:  
- Single invalid chain or chainType  
- Multiple invalid chains or chainTypes  
- Combination of valid and invalid parameters  
**Expected Outcome:**  
- Request fails with Response Code = 400.  
- Error messages validate against schema.

---

### TOKENS_23
**Description:** GET request with invalid `minPriceUSD` parameters:  
- Negative values  
- Too low or too high values  
- Invalid formats  
**Expected Outcome:**  
- Request fails with Response Code = 400.  
- Error message specifies valid input constraints.

---

### TOKENS_24
**Description:** GET request with a combination of all invalid parameters.  
**Expected Outcome:**  
- Request fails with Response Code = 400.  
- Error message specifies multiple invalid inputs.

---

### TOKENS_25
**Description:** GET request with a combination of valid and invalid parameters.  
**Expected Outcome:**  
- Request fails with Response Code = 400.  
- Error message specifies invalid inputs.

---

## Rate Limiting and API Key Tests

### TOKENS_26
**Description:** GET request with too many parameters.  
**Expected Outcome:**  
- Request passes if valid.  

---

### TOKENS_27
**Description:** GET request with an expired API key.  
**Expected Outcome:**  
- Request fails with Response Code = 400.  
- Error message indicates `Unauthorized`.

---

### TOKENS_28
**Description:** GET request with an invalid API key.  
**Expected Outcome:**  
- Request fails with Response Code = 400.  
- Error message indicates `Unauthorized`.

---

### TOKENS_29
**Description:** Case sensitivity validation for each parameter.  
**Expected Outcome:**  
- Valid inputs are case-insensitive.  
- Invalid cases fail gracefully.

---

### TOKENS_30
**Description:** 21st request should trigger rate limiting.  
**Expected Outcome:**  
- Request fails with Response Code = 429.  
- Error message indicates "Rate limit exceeded, retry in 2 hours".

---
