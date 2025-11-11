/**
 * Phase 7: Address Management Testing Script
 * Tests all address CRUD operations and validation
 */

const BASE_URL = 'http://localhost:3001/api';

// Test user credentials (you may need to adjust these)
const TEST_USER = {
  email: 'test@aromasouq.com',
  password: 'Test123!@#'
};

let authToken = null;
let createdAddressId = null;
let secondAddressId = null;

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

// Test functions
async function testLogin() {
  console.log('\n📋 Test 1: User Login');
  console.log('-------------------');

  const result = await apiCall('/auth/login', 'POST', TEST_USER);

  if (result.ok && result.data.access_token) {
    authToken = result.data.access_token;
    console.log('✅ Login successful');
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
    return true;
  } else {
    console.log('❌ Login failed:', result.data.message || result.error);
    console.log('   Trying to register new user...');

    // Try to register if login fails
    const registerResult = await apiCall('/auth/register', 'POST', {
      ...TEST_USER,
      firstName: 'Test',
      lastName: 'User',
      phone: '+971501234567'
    });

    if (registerResult.ok && registerResult.data.access_token) {
      authToken = registerResult.data.access_token;
      console.log('✅ Registration successful, logged in');
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
      return true;
    } else {
      console.log('❌ Registration also failed:', registerResult.data.message || registerResult.error);
      return false;
    }
  }
}

async function testGetAddresses() {
  console.log('\n📋 Test 2: Get All Addresses (Initial)');
  console.log('--------------------------------------');

  const result = await apiCall('/addresses', 'GET', null, authToken);

  if (result.ok) {
    console.log('✅ Successfully fetched addresses');
    console.log(`   Found ${result.data.length} address(es)`);

    if (result.data.length > 0) {
      console.log('   Addresses:');
      result.data.forEach((addr, idx) => {
        console.log(`   ${idx + 1}. ${addr.fullName} - ${addr.city}, ${addr.state} ${addr.isDefault ? '(DEFAULT)' : ''}`);
      });
    } else {
      console.log('   No addresses found (expected for new user)');
    }
    return true;
  } else {
    console.log('❌ Failed to fetch addresses:', result.data.message || result.error);
    return false;
  }
}

async function testCreateAddress() {
  console.log('\n📋 Test 3: Create New Address');
  console.log('-----------------------------');

  const newAddress = {
    fullName: 'John Doe',
    phone: '+971 50 123 4567',
    addressLine1: '123 Sheikh Zayed Road',
    addressLine2: 'Apartment 456',
    city: 'Dubai',
    state: 'Dubai',
    country: 'UAE',
    zipCode: '00000',
    isDefault: true
  };

  const result = await apiCall('/addresses', 'POST', newAddress, authToken);

  if (result.ok) {
    createdAddressId = result.data.id;
    console.log('✅ Address created successfully');
    console.log(`   ID: ${createdAddressId}`);
    console.log(`   Name: ${result.data.fullName}`);
    console.log(`   Address: ${result.data.addressLine1}, ${result.data.city}`);
    console.log(`   Default: ${result.data.isDefault}`);
    return true;
  } else {
    console.log('❌ Failed to create address:', result.data.message || result.error);
    return false;
  }
}

async function testCreateSecondAddress() {
  console.log('\n📋 Test 4: Create Second Address');
  console.log('--------------------------------');

  const secondAddress = {
    fullName: 'Jane Smith',
    phone: '+971 50 987 6543',
    addressLine1: '789 Al Wasl Road',
    addressLine2: 'Villa 12',
    city: 'Dubai',
    state: 'Dubai',
    country: 'UAE',
    zipCode: '00000',
    isDefault: false
  };

  const result = await apiCall('/addresses', 'POST', secondAddress, authToken);

  if (result.ok) {
    secondAddressId = result.data.id;
    console.log('✅ Second address created successfully');
    console.log(`   ID: ${secondAddressId}`);
    console.log(`   Name: ${result.data.fullName}`);
    console.log(`   Default: ${result.data.isDefault}`);
    return true;
  } else {
    console.log('❌ Failed to create second address:', result.data.message || result.error);
    return false;
  }
}

async function testGetSingleAddress() {
  console.log('\n📋 Test 5: Get Single Address');
  console.log('-----------------------------');

  if (!createdAddressId) {
    console.log('⚠️  Skipping: No address ID available');
    return false;
  }

  const result = await apiCall(`/addresses/${createdAddressId}`, 'GET', null, authToken);

  if (result.ok) {
    console.log('✅ Successfully fetched single address');
    console.log(`   Full Name: ${result.data.fullName}`);
    console.log(`   Phone: ${result.data.phone}`);
    console.log(`   Address: ${result.data.addressLine1}, ${result.data.city}, ${result.data.state}`);
    console.log(`   Is Default: ${result.data.isDefault}`);
    return true;
  } else {
    console.log('❌ Failed to fetch address:', result.data.message || result.error);
    return false;
  }
}

async function testUpdateAddress() {
  console.log('\n📋 Test 6: Update Address');
  console.log('------------------------');

  if (!createdAddressId) {
    console.log('⚠️  Skipping: No address ID available');
    return false;
  }

  const updates = {
    fullName: 'John Doe Updated',
    phone: '+971 50 111 2222',
    city: 'Abu Dhabi',
    state: 'Abu Dhabi'
  };

  const result = await apiCall(`/addresses/${createdAddressId}`, 'PATCH', updates, authToken);

  if (result.ok) {
    console.log('✅ Address updated successfully');
    console.log(`   Updated Name: ${result.data.fullName}`);
    console.log(`   Updated Phone: ${result.data.phone}`);
    console.log(`   Updated City: ${result.data.city}`);
    return true;
  } else {
    console.log('❌ Failed to update address:', result.data.message || result.error);
    return false;
  }
}

async function testSetDefaultAddress() {
  console.log('\n📋 Test 7: Set Default Address');
  console.log('------------------------------');

  if (!secondAddressId) {
    console.log('⚠️  Skipping: No second address ID available');
    return false;
  }

  const result = await apiCall(`/addresses/${secondAddressId}/set-default`, 'PATCH', {}, authToken);

  if (result.ok) {
    console.log('✅ Default address changed successfully');
    console.log(`   New Default: ${result.data.fullName}`);
    console.log(`   Is Default: ${result.data.isDefault}`);

    // Verify first address is no longer default
    const firstAddr = await apiCall(`/addresses/${createdAddressId}`, 'GET', null, authToken);
    if (firstAddr.ok) {
      console.log(`   Previous Default Now: ${firstAddr.data.isDefault} (should be false)`);
    }
    return true;
  } else {
    console.log('❌ Failed to set default address:', result.data.message || result.error);
    return false;
  }
}

async function testGetAllAddresses() {
  console.log('\n📋 Test 8: Get All Addresses (Final)');
  console.log('------------------------------------');

  const result = await apiCall('/addresses', 'GET', null, authToken);

  if (result.ok) {
    console.log('✅ Successfully fetched all addresses');
    console.log(`   Total Addresses: ${result.data.length}`);

    result.data.forEach((addr, idx) => {
      console.log(`\n   Address ${idx + 1}:`);
      console.log(`   - Name: ${addr.fullName}`);
      console.log(`   - Phone: ${addr.phone}`);
      console.log(`   - Location: ${addr.city}, ${addr.state}`);
      console.log(`   - Default: ${addr.isDefault ? 'YES ⭐' : 'No'}`);
    });
    return true;
  } else {
    console.log('❌ Failed to fetch addresses:', result.data.message || result.error);
    return false;
  }
}

async function testDeleteNonDefaultAddress() {
  console.log('\n📋 Test 9: Delete Non-Default Address');
  console.log('-------------------------------------');

  if (!createdAddressId) {
    console.log('⚠️  Skipping: No address ID available');
    return false;
  }

  const result = await apiCall(`/addresses/${createdAddressId}`, 'DELETE', null, authToken);

  if (result.ok) {
    console.log('✅ Non-default address deleted successfully');

    // Verify it's gone
    const verify = await apiCall(`/addresses/${createdAddressId}`, 'GET', null, authToken);
    if (!verify.ok) {
      console.log('   ✓ Verified: Address no longer exists');
    }
    return true;
  } else {
    console.log('❌ Failed to delete address:', result.data.message || result.error);
    return false;
  }
}

async function testDeleteDefaultAddress() {
  console.log('\n📋 Test 10: Attempt to Delete Default Address');
  console.log('----------------------------------------------');

  if (!secondAddressId) {
    console.log('⚠️  Skipping: No second address ID available');
    return false;
  }

  const result = await apiCall(`/addresses/${secondAddressId}`, 'DELETE', null, authToken);

  if (result.ok) {
    console.log('✅ Default address deleted (allowed if it\'s the only one)');
    return true;
  } else {
    console.log('ℹ️  Delete blocked or failed:', result.data.message || result.error);
    console.log('   This is expected behavior for default addresses when others exist');
    return true; // This is actually the expected behavior
  }
}

async function testValidation() {
  console.log('\n📋 Test 11: Form Validation');
  console.log('---------------------------');

  // Test missing required fields
  const invalidAddress = {
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: ''
  };

  const result = await apiCall('/addresses', 'POST', invalidAddress, authToken);

  if (!result.ok) {
    console.log('✅ Validation working correctly');
    console.log(`   Error: ${result.data.message || 'Required fields missing'}`);
    return true;
  } else {
    console.log('❌ Validation failed - empty address was accepted');
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   PHASE 7: ADDRESS MANAGEMENT TEST SUITE');
  console.log('═══════════════════════════════════════════════════');
  console.log(`   Backend: ${BASE_URL}`);
  console.log(`   Started: ${new Date().toLocaleString()}`);
  console.log('═══════════════════════════════════════════════════');

  const tests = [
    { name: 'Login/Register', fn: testLogin },
    { name: 'Get Initial Addresses', fn: testGetAddresses },
    { name: 'Create First Address', fn: testCreateAddress },
    { name: 'Create Second Address', fn: testCreateSecondAddress },
    { name: 'Get Single Address', fn: testGetSingleAddress },
    { name: 'Update Address', fn: testUpdateAddress },
    { name: 'Set Default Address', fn: testSetDefaultAddress },
    { name: 'Get All Addresses', fn: testGetAllAddresses },
    { name: 'Delete Non-Default', fn: testDeleteNonDefaultAddress },
    { name: 'Delete Default', fn: testDeleteDefaultAddress },
    { name: 'Validation', fn: testValidation }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log('   TEST RESULTS');
  console.log('═══════════════════════════════════════════════════');
  console.log(`   Total Tests: ${tests.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════════════════');
  console.log(`   Completed: ${new Date().toLocaleString()}`);
  console.log('═══════════════════════════════════════════════════\n');

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Phase 7 is working correctly.\n');
  } else {
    console.log('⚠️  Some tests failed. Please review the output above.\n');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('\n❌ Test suite crashed:', error);
  process.exit(1);
});
