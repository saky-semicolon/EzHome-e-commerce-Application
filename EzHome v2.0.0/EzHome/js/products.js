// EzHome Products Database
window.products = [
    // Smart Home Voice Assistants
    {
        id: 1,
        name: "Echo Hub Essential",
        description: "Smart voice assistant hub with basic automation features",
        price: 199.00,
        category: "Voice Assistants",
        family: "Essential",
        image_url: "images/Echo Hub Essential.JPG",
        in_stock: true,
        featured: true,
        specifications: {
            dimensions: "14.8 x 14.8 x 9.9 cm",
            weight: "940g",
            connectivity: "Wi-Fi, Bluetooth",
            power: "15W adapter"
        },
        colors: ["Charcoal", "Glacier White", "Twilight Blue"],
        rating: 4.5
    },
    {
        id: 2,
        name: "Echo Hub Standard",
        description: "Advanced voice assistant with enhanced smart home control",
        price: 299.00,
        category: "Voice Assistants",
        family: "Standard",
        image_url: "images/Echo Hub Standard.JPG",
        in_stock: true,
        featured: true,
        specifications: {
            dimensions: "23.0 x 23.0 x 10.8 cm",
            weight: "1.55kg",
            connectivity: "Wi-Fi 6, Bluetooth 5.0, Zigbee",
            power: "30W adapter"
        },
        colors: ["Charcoal", "Glacier White"],
        rating: 4.7
    },
    {
        id: 3,
        name: "Smart Light Sensor Pro",
        description: "Advanced light sensor with motion detection and scheduling",
        price: 89.00,
        category: "Sensors",
        family: "Standard",
        image_url: "images/Smart Light Sensor Pro.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "6.0 x 6.0 x 2.5 cm",
            weight: "120g",
            connectivity: "Zigbee 3.0",
            power: "Battery (2 years)"
        },
        colors: ["White", "Black"],
        rating: 4.3
    },
    {
        id: 4,
        name: "Smart Planter Garden",
        description: "Automated plant care system with water and light management",
        price: 149.00,
        category: "Smart Furniture",
        family: "Garden",
        image_url: "images/Smart Planter Garden.JPG",
        in_stock: true,
        featured: true,
        specifications: {
            dimensions: "30.0 x 30.0 x 35.0 cm",
            weight: "2.8kg",
            connectivity: "Wi-Fi",
            power: "12V adapter"
        },
        colors: ["Terra Cotta", "Stone Gray", "Forest Green"],
        rating: 4.6
    },
    {
        id: 5,
        name: "Sky Blinds Automated",
        description: "Smart motorized blinds with voice and app control",
        price: 349.00,
        category: "Smart Furniture",
        family: "Sky",
        image_url: "images/SkyBlindsAutomation.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "Custom fit up to 200cm width",
            weight: "3.5kg",
            connectivity: "Wi-Fi, Z-Wave",
            power: "Rechargeable battery"
        },
        colors: ["Pure White", "Warm Gray", "Blackout"],
        rating: 4.4
    },
    {
        id: 6,
        name: "Smart Security Camera",
        description: "HD security camera with night vision and motion alerts",
        price: 179.00,
        category: "Security",
        family: "Guardian",
        image_url: "images/Smart Security Camera.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "10.0 x 6.5 x 6.5 cm",
            weight: "320g",
            connectivity: "Wi-Fi 5",
            power: "Power adapter or battery"
        },
        colors: ["White", "Black"],
        rating: 4.2
    },
    {
        id: 7,
        name: "Smart LED Bulb Set",
        description: "Color-changing LED bulbs with voice control (4-pack)",
        price: 79.00,
        category: "Lighting",
        family: "Illuminate",
        image_url: "images/Smart LED Bulb Set.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "6.0 x 11.0 cm per bulb",
            weight: "85g per bulb",
            connectivity: "Wi-Fi",
            power: "9W LED"
        },
        colors: ["Multi-color RGB"],
        rating: 4.1
    },
    {
        id: 8,
        name: "Smart Thermostat Pro",
        description: "Learning thermostat with energy-saving algorithms",
        price: 249.00,
        category: "Climate Control",
        family: "Comfort",
        image_url: "images/Smart Thermostat Pro.JPG",
        in_stock: true,
        featured: true,
        specifications: {
            dimensions: "8.4 x 8.4 x 3.2 cm",
            weight: "280g",
            connectivity: "Wi-Fi, Bluetooth",
            power: "24V HVAC wiring"
        },
        colors: ["Stainless Steel", "Black", "White"],
        rating: 4.8
    },
    {
        id: 9,
        name: "Smart Door Lock",
        description: "Keyless entry with smartphone and voice control",
        price: 199.00,
        category: "Security",
        family: "Guardian",
        image_url: "images/Smart Door Lock.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "15.2 x 7.6 x 3.8 cm",
            weight: "1.1kg",
            connectivity: "Wi-Fi, Bluetooth",
            power: "4 AA batteries"
        },
        colors: ["Satin Nickel", "Venetian Bronze"],
        rating: 4.3
    },
    {
        id: 10,
        name: "Smart Smoke Detector",
        description: "Intelligent smoke and CO detector with smartphone alerts",
        price: 129.00,
        category: "Security",
        family: "Guardian",
        image_url: "images/Smart Smoke Detector.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "13.8 x 13.8 x 3.8 cm",
            weight: "380g",
            connectivity: "Wi-Fi",
            power: "Lithium battery (10 years)"
        },
        colors: ["White"],
        rating: 4.7
    },
    {
        id: 11,
        name: "Smart Water Leak Sensor",
        description: "Water detection sensor with instant smartphone notifications",
        price: 49.00,
        category: "Sensors",
        family: "Guardian",
        image_url: "images/Smart Water Leak Sensor.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "7.1 x 7.1 x 1.9 cm",
            weight: "95g",
            connectivity: "Wi-Fi",
            power: "Battery (2 years)"
        },
        colors: ["White"],
        rating: 4.4
    },
    {
        id: 12,
        name: "Smart Ceiling Fan",
        description: "Voice-controlled ceiling fan with LED lighting",
        price: 299.00,
        category: "Climate Control",
        family: "Comfort",
        image_url: "images/led ceiling fan with remote.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "132 cm diameter",
            weight: "8.2kg",
            connectivity: "Wi-Fi",
            power: "75W motor + 18W LED"
        },
        colors: ["Brushed Nickel", "White", "Bronze"],
        rating: 4.5
    },
    {
        id: 13,
        name: "Smart Garage Door Opener",
        description: "WiFi-enabled garage door controller with smartphone access",
        price: 179.00,
        category: "Security",
        family: "Guardian",
        image_url: "images/Smart Garage Door Opener.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "12.7 x 8.9 x 3.8 cm",
            weight: "450g",
            connectivity: "Wi-Fi",
            power: "Power adapter"
        },
        colors: ["Black"],
        rating: 4.2
    },
    {
        id: 14,
        name: "Smart Irrigation Controller",
        description: "Automated sprinkler system with weather integration",
        price: 229.00,
        category: "Smart Furniture",
        family: "Garden",
        image_url: "images/Smart Irrigation Controller.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "20.3 x 15.2 x 7.6 cm",
            weight: "680g",
            connectivity: "Wi-Fi",
            power: "24V AC transformer"
        },
        colors: ["Green", "Gray"],
        rating: 4.6
    },
    {
        id: 15,
        name: "Smart Outdoor Camera",
        description: "Weatherproof security camera with solar panel option",
        price: 249.00,
        category: "Security",
        family: "Guardian",
        image_url: "images/Smart Outdoor Camera.JPG",
        in_stock: true,
        featured: true,
        specifications: {
            dimensions: "11.4 x 6.4 x 6.4 cm",
            weight: "420g",
            connectivity: "Wi-Fi 5",
            power: "Solar panel or power adapter"
        },
        colors: ["White", "Black"],
        rating: 4.3
    },
    {
        id: 16,
        name: "Smart Motion Sensor",
        description: "PIR motion detector with customizable sensitivity",
        price: 39.00,
        category: "Sensors",
        family: "Guardian",
        image_url: "images/Smart Motion Sensor.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "6.5 x 6.5 x 3.2 cm",
            weight: "110g",
            connectivity: "Zigbee 3.0",
            power: "Battery (18 months)"
        },
        colors: ["White", "Black"],
        rating: 4.0
    },
    {
        id: 17,
        name: "Smart Window Sensor",
        description: "Door and window sensor for security monitoring",
        price: 29.00,
        category: "Sensors",
        family: "Guardian",
        image_url: "images/Smart Window Sensor.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "5.1 x 2.5 x 1.3 cm",
            weight: "45g",
            connectivity: "Zigbee 3.0",
            power: "Battery (2 years)"
        },
        colors: ["White", "Black"],
        rating: 4.1
    },
    {
        id: 18,
        name: "Smart Light Switch",
        description: "In-wall smart switch with dimming capabilities",
        price: 49.00,
        category: "Lighting",
        family: "Illuminate",
        image_url: "images/Smart Light Switch.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "11.7 x 7.0 x 4.1 cm",
            weight: "140g",
            connectivity: "Wi-Fi",
            power: "120V AC"
        },
        colors: ["White", "Ivory", "Light Almond"],
        rating: 4.4
    },
    {
        id: 19,
        name: "Smart Outlet Plug",
        description: "WiFi-enabled smart plug with energy monitoring",
        price: 25.00,
        category: "Lighting",
        family: "Illuminate",
        image_url: "images/plug.JPG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "6.1 x 5.1 x 7.6 cm",
            weight: "120g",
            connectivity: "Wi-Fi",
            power: "15A max"
        },
        colors: ["White"],
        rating: 4.2
    },
    {
        id: 20,
        name: "Smart Air Purifier",
        description: "HEPA air purifier with app control and air quality monitoring",
        price: 199.00,
        category: "Climate Control",
        family: "Comfort",
        image_url: "images/Smart Air Purifier.PNG",
        in_stock: true,
        featured: false,
        specifications: {
            dimensions: "30.5 x 20.3 x 50.8 cm",
            weight: "4.5kg",
            connectivity: "Wi-Fi",
            power: "45W"
        },
        colors: ["White", "Black"],
        rating: 4.5
    }
];

// Product helper functions
window.getProductById = function(id) {
    return window.products.find(product => product.id === parseInt(id));
};

window.getProductsByCategory = function(category) {
    return window.products.filter(product => product.category === category);
};

window.getFeaturedProducts = function() {
    return window.products.filter(product => product.featured);
};

window.searchProducts = function(query) {
    const searchTerm = query.toLowerCase();
    return window.products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
};
