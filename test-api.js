// Test script to verify API functionality
async function testCreateUser() {
    const testUser = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@test.com",
        password: "password123",
        role: "employee",
        mobile: "+84901234567",
        gender: "male",
        address: "123 Test Street, Ho Chi Minh City"
    };

    try {
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser)
        });

        const result = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', result);

        if (response.ok) {
            console.log('✅ User created successfully!');
        } else {
            console.log('❌ Failed to create user:', result.message);
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

async function testGetUsers() {
    try {
        const response = await fetch('http://localhost:3000/api/users');
        const result = await response.json();

        console.log('Get Users Response:', result);
        console.log('Number of users:', result.data?.length || 0);
    } catch (error) {
        console.error('❌ Error fetching users:', error);
    }
}

// Run tests
console.log('🧪 Testing User API...');
testCreateUser().then(() => {
    console.log('\n📋 Testing Get Users...');
    return testGetUsers();
});
