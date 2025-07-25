const users = [
    {
        "username": "admin",
        "password": "admin123",
        "role": "Admin",
        "email": "admin@ezhome.com",
        "phone": "111-222-3333",
        "address": "123 Admin Way, Suite 100, Command Center, 12345"
    },
    {
        "username": "staff",
        "password": "staff123",
        "role": "Staff",
        "email": "staff@ezhome.com",
        "phone": "444-555-6666",
        "address": "456 Staff Road, Unit 20, Operations Hub, 67890"
    },
    {
        "username": "user",
        "password": "user123",
        "role": "User",
        "email": "user@example.com",
        "phone": "777-888-9999",
        "address": "789 User Lane, Apt. 5, Residence Complex, 54321"
    }
];

if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
}
