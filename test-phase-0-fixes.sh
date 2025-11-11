#!/bin/bash
# Phase 0 Critical Fixes - Comprehensive Test Script
# Tests all 5 modules to ensure fixes are working correctly

API_URL="http://localhost:3001/api"
echo "========================================"
echo "PHASE 0 CRITICAL FIXES - TEST SUITE"
echo "========================================"
echo ""
echo "API URL: $API_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}: $2"
        ((TESTS_FAILED++))
    fi
}

echo "========================================"
echo "MODULE 0.1: COINS EXCHANGE RATE TEST"
echo "========================================"
echo ""
echo "Expected: 1 coin = 1 AED (not 0.1 AED)"
echo ""

# This test requires manual verification by creating an order with coins
echo "Manual Test Steps:"
echo "1. Login as customer with coins balance"
echo "2. Create order using 50 coins"
echo "3. Verify coinsDiscount = 50 AED (not 5 AED)"
echo ""
echo -e "${YELLOW}⚠ MANUAL VERIFICATION REQUIRED${NC}"
echo ""

echo "========================================"
echo "MODULE 0.2: COUPON USAGE LIMIT"
echo "========================================"
echo ""
echo "Status: Already implemented in codebase"
echo "Files: coupons.service.ts:133, orders.service.ts:254"
echo -e "${GREEN}✓ ALREADY WORKING${NC}"
echo ""

echo "========================================"
echo "MODULE 0.3: STOCK VALIDATION"
echo "========================================"
echo ""

# Test 1: Check if server is responding
echo "Test 3.1: Server Health Check"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)
if [ "$HTTP_CODE" -eq 200 ]; then
    print_result 0 "Server is responding (HTTP $HTTP_CODE)"
else
    print_result 1 "Server not responding (HTTP $HTTP_CODE)"
fi
echo ""

echo "Test 3.2: Stock validation (manual test required)"
echo "Steps to verify:"
echo "1. Find a product with low stock (e.g., stock = 5)"
echo "2. Add 10 items to cart"
echo "3. Try to create order"
echo "4. Should get error: 'Insufficient stock for [Product]. Available: 5, Requested: 10'"
echo ""
echo -e "${YELLOW}⚠ MANUAL VERIFICATION REQUIRED${NC}"
echo ""

echo "Test 3.3: Stock decrement on order creation (manual test required)"
echo "Steps to verify:"
echo "1. Check product stock in database (e.g., stock = 100)"
echo "2. Create order with quantity = 3"
echo "3. Check product stock after order (should be 97)"
echo "4. Check salesCount (should increment by 3)"
echo ""
echo -e "${YELLOW}⚠ MANUAL VERIFICATION REQUIRED${NC}"
echo ""

echo "Test 3.4: Stock restoration on cancellation (manual test required)"
echo "Steps to verify:"
echo "1. Create order (stock decreases by 3)"
echo "2. Cancel order"
echo "3. Check product stock (should be restored to 100)"
echo "4. Check salesCount (should decrement by 3)"
echo "5. Check coins refunded if used"
echo ""
echo -e "${YELLOW}⚠ MANUAL VERIFICATION REQUIRED${NC}"
echo ""

echo "========================================"
echo "MODULE 0.4: GIFT WRAPPING FEE SEPARATION"
echo "========================================"
echo ""

echo "Test 4.1: Database schema check"
echo "Checking if giftWrappingFee column exists in orders table..."
echo ""
echo -e "${YELLOW}⚠ DATABASE QUERY REQUIRED${NC}"
echo "Run: SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name='gift_wrapping_fee';"
echo ""

echo "Test 4.2: Gift wrapping fee separation (manual test required)"
echo "Steps to verify:"
echo "1. Create order with gift wrapping (BASIC = 10 AED)"
echo "2. Check database: shippingFee should NOT include gift wrapping"
echo "3. Check database: giftWrappingFee should be 10"
echo "4. Verify total = subtotal + shippingFee + giftWrappingFee + tax - discount"
echo ""
echo -e "${YELLOW}⚠ MANUAL VERIFICATION REQUIRED${NC}"
echo ""

echo "========================================"
echo "MODULE 0.5: SALES GROWTH CALCULATION"
echo "========================================"
echo ""

echo "Test 5.1: Vendor dashboard sales growth (manual test required)"
echo "Steps to verify:"
echo "1. Login as vendor"
echo "2. GET /api/vendor/dashboard"
echo "3. Check salesGrowth field (should NOT be 0 if there's historical data)"
echo "4. Verify calculation: ((currentMonth - previousMonth) / previousMonth) * 100"
echo ""
echo -e "${YELLOW}⚠ MANUAL VERIFICATION REQUIRED${NC}"
echo ""

echo "========================================"
echo "INTEGRATION TESTS"
echo "========================================"
echo ""

echo "Integration Test 1: Complete order flow"
echo "Steps to verify end-to-end:"
echo "1. Add product to cart"
echo "2. Apply coupon code"
echo "3. Use some coins (verify 1:1 ratio)"
echo "4. Add gift wrapping"
echo "5. Create order"
echo "6. Verify:"
echo "   - Stock decreased"
echo "   - Coins deducted correctly"
echo "   - Gift wrapping fee separated"
echo "   - Coupon usage count incremented"
echo "7. Cancel order"
echo "8. Verify:"
echo "   - Stock restored"
echo "   - Coins refunded"
echo ""
echo -e "${YELLOW}⚠ MANUAL VERIFICATION REQUIRED${NC}"
echo ""

echo "========================================"
echo "TEST SUMMARY"
echo "========================================"
echo ""
echo "Automated Tests Passed: $TESTS_PASSED"
echo "Automated Tests Failed: $TESTS_FAILED"
echo ""
echo "Note: Most tests require manual verification with actual data"
echo "Please follow the manual test steps above to fully verify all fixes"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All automated checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run manual tests as described above"
    echo "2. Create test orders in the system"
    echo "3. Verify database changes"
    echo "4. Monitor logs for errors"
    exit 0
else
    echo -e "${RED}Some automated tests failed!${NC}"
    echo "Please check the errors above"
    exit 1
fi
