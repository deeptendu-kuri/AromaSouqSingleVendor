/**
 * Phase 7: Address Management Simple Test
 * Uses existing authentication token
 */

const BASE_URL = 'http://localhost:3001/api';

// Use existing token from cookies.txt
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMmIyYzkxNS00YWM4LTQxM2ItOTA4ZC05NWQ5MDQxYTE1YTEiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzYyMDE0OTQzLCJleHAiOjE3NjI2MTk3NDN9.qpK4CRUyjLNTpwMiDgxjKIEiiov1s3W4_HdI3FF2Ltc';

let createdAddressId = null;
let secondAddressId = null;

// Helper function
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  };

  const options = { method, headers };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    return { status: 0, ok: false, error: error.message };
  }
}

async function runQuickTest() {
  console.log('\n🧪 PHASE 7 QUICK TEST\n');

  // Test 1: Get existing addresses
  console.log('1️⃣  Fetching existing addresses...');
  const initial = await apiCall('/addresses');
  if (initial.ok) {
    console.log(`   ✅ Found ${initial.data.length} existing address(es)`);
  } else {
    console.log(`   ❌ Failed: ${initial.data.message}`);
    return;
  }

  // Test 2: Create first address
  console.log('\n2️⃣  Creating first address...');
  const addr1 = await apiCall('/addresses', 'POST', {
    fullName: 'Test User',
    phone: '+971501234567',
    addressLine1: '123 Sheikh Zayed Road',
    addressLine2: 'Apartment 456',
    city: 'Dubai',
    state: 'Dubai',
    country: 'UAE',
    zipCode: '00000',
    isDefault: true
  });

  if (addr1.ok) {
    createdAddressId = addr1.data.id;
    console.log(`   ✅ Created: ${addr1.data.fullName} (ID: ${createdAddressId})`);
  } else {
    console.log(`   ❌ Failed: ${addr1.data.message}`);
  }

  // Test 3: Create second address
  console.log('\n3️⃣  Creating second address...');
  const addr2 = await apiCall('/addresses', 'POST', {
    fullName: 'Jane Doe',
    phone: '+971509876543',
    addressLine1: '789 Al Wasl Road',
    city: 'Dubai',
    state: 'Dubai',
    country: 'UAE',
    zipCode: '00000',
    isDefault: false
  });

  if (addr2.ok) {
    secondAddressId = addr2.data.id;
    console.log(`   ✅ Created: ${addr2.data.fullName} (ID: ${secondAddressId})`);
  } else {
    console.log(`   ❌ Failed: ${addr2.data.message}`);
  }

  // Test 4: Get single address
  if (createdAddressId) {
    console.log('\n4️⃣  Fetching single address...');
    const single = await apiCall(`/addresses/${createdAddressId}`);
    if (single.ok) {
      console.log(`   ✅ Retrieved: ${single.data.fullName}, ${single.data.city}`);
    } else {
      console.log(`   ❌ Failed: ${single.data.message}`);
    }
  }

  // Test 5: Update address
  if (createdAddressId) {
    console.log('\n5️⃣  Updating address...');
    const update = await apiCall(`/addresses/${createdAddressId}`, 'PATCH', {
      fullName: 'Test User UPDATED',
      city: 'Abu Dhabi',
      state: 'Abu Dhabi'
    });
    if (update.ok) {
      console.log(`   ✅ Updated to: ${update.data.fullName}, ${update.data.city}`);
    } else {
      console.log(`   ❌ Failed: ${update.data.message}`);
    }
  }

  // Test 6: Set default
  if (secondAddressId) {
    console.log('\n6️⃣  Setting second address as default...');
    const setDefault = await apiCall(`/addresses/${secondAddressId}/set-default`, 'PATCH', {});
    if (setDefault.ok) {
      console.log(`   ✅ Set as default: ${setDefault.data.fullName}`);
    } else {
      console.log(`   ❌ Failed: ${setDefault.data.message}`);
    }
  }

  // Test 7: List all addresses
  console.log('\n7️⃣  Listing all addresses...');
  const all = await apiCall('/addresses');
  if (all.ok) {
    console.log(`   ✅ Total addresses: ${all.data.length}`);
    all.data.forEach((a, i) => {
      console.log(`      ${i + 1}. ${a.fullName} - ${a.city} ${a.isDefault ? '⭐ DEFAULT' : ''}`);
    });
  } else {
    console.log(`   ❌ Failed: ${all.data.message}`);
  }

  // Test 8: Delete non-default
  if (createdAddressId) {
    console.log('\n8️⃣  Deleting non-default address...');
    const del = await apiCall(`/addresses/${createdAddressId}`, 'DELETE');
    if (del.ok) {
      console.log(`   ✅ Deleted successfully`);
    } else {
      console.log(`   ❌ Failed: ${del.data.message}`);
    }
  }

  // Test 9: Final count
  console.log('\n9️⃣  Final address count...');
  const final = await apiCall('/addresses');
  if (final.ok) {
    console.log(`   ✅ Remaining addresses: ${final.data.length}`);
  }

  console.log('\n✅ Phase 7 testing complete!\n');
}

runQuickTest().catch(console.error);
