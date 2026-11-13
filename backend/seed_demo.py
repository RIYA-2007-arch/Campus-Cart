import hashlib
import os
import random
import re
import shutil
import sys
from datetime import datetime, timedelta
from xml.sax.saxutils import escape

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
PHOTO_DIR = os.path.join(BASE_DIR, "product_photos")
MARK = "[demo]"
THIS_YEAR = 2026
PHRASES = [
    "Working perfectly, no issues.",
    "Used carefully, all accessories included.",
    "Selling because I upgraded. Can show it working.",
    "Light signs of use, nothing major.",
    "Original box and bill available.",
]
PALETTES = {
    "electronic": ("#0b7a82", "#12304a"), "sport": ("#f59e0b", "#b45309"), "book": ("#6366f1", "#312e81"),
    "study": ("#10b981", "#065f46"), "calculator": ("#ef4444", "#7f1d1d"), "college": ("#3b82f6", "#1e3a8a"),
    "hostel": ("#ec4899", "#831843"), "other": ("#8b5cf6", "#4c1d95"),
}

# (category keywords separated by |, photo group key, emoji, [(title, original price, resale price, condition, age in years)])
SECTIONS = [
    ("electronic", "asus-laptop", "💻", [
        ("ASUS Vivobook 15 Laptop (Core i5 11th Gen, 8GB RAM, 512GB SSD)", 52000, 48000, "Good", 3),
        ("ASUS Vivobook 16 Laptop (Ryzen 5 5600H, 16GB RAM, 512GB SSD)", 58000, 42000, "Very Good", 2),
        ("ASUS Vivobook Go 14 Laptop (Ryzen 3, 8GB RAM, 256GB SSD)", 32000, 28000, "Good", 2),
        ("ASUS TUF Gaming F15 Laptop (Core i5 10th Gen, GTX 1650, 16GB RAM, 512GB SSD)", 72000, 42000, "Good", 3),
        ("ASUS TUF Gaming A15 Laptop (Ryzen 7, RTX 3050, 16GB RAM, 512GB SSD)", 85000, 45000, "Very Good", 2),
        ("ASUS ZenBook 14 OLED Laptop (Core i5 12th Gen, 16GB RAM, 512GB SSD)", 85000, 42000, "Like New", 1),
        ("ASUS ROG Strix G15 Laptop (Ryzen 7, RTX 3060, 16GB RAM, 1TB SSD)", 120000, 45000, "Very Good", 2),
    ]),
    ("electronic", "hp-laptop", "💻", [
        ("HP 15s Laptop (Core i3 11th Gen, 8GB RAM, 256GB SSD)", 42000, 32000, "Good", 3),
        ("HP 14s Laptop (Ryzen 5 5500U, 8GB RAM, 512GB SSD)", 48000, 38000, "Good", 3),
        ("HP Pavilion 14 Laptop (Core i5 11th Gen, 16GB RAM, 512GB SSD)", 68000, 42000, "Very Good", 3),
        ("HP Victus Gaming Laptop (Ryzen 5, RTX 3050, 16GB RAM, 512GB SSD)", 75000, 42000, "Very Good", 2),
        ("HP ProBook 440 G8 Laptop (Core i5, 8GB RAM, 512GB SSD)", 70000, 36000, "Good", 4),
    ]),
    ("electronic", "dell-laptop", "💻", [
        ("Dell Inspiron 15 Laptop (Core i5 11th Gen, 8GB RAM, 512GB SSD)", 55000, 38000, "Good", 3),
        ("Dell Vostro 3510 Laptop (Core i3 11th Gen, 8GB RAM, 256GB SSD)", 45000, 32000, "Good", 3),
        ("Dell Latitude 5420 Laptop (Core i5 11th Gen, 16GB RAM, 512GB SSD)", 90000, 38000, "Good", 4),
        ("Dell G15 Gaming Laptop (Core i5, RTX 3050, 16GB RAM, 512GB SSD)", 85000, 45000, "Very Good", 2),
    ]),
    ("electronic", "lenovo-laptop", "💻", [
        ("Lenovo IdeaPad Slim 3 Laptop (Core i3 12th Gen, 8GB RAM, 512GB SSD)", 42000, 32000, "Very Good", 2),
        ("Lenovo IdeaPad Gaming 3 Laptop (Ryzen 5, GTX 1650, 8GB RAM, 512GB SSD)", 62000, 51000, "Good", 3),
        ("Lenovo ThinkPad E14 Laptop (Core i5, 16GB RAM, 512GB SSD)", 80000, 38000, "Good", 3),
        ("Lenovo LOQ Gaming Laptop (Core i5 12th Gen, RTX 3050, 16GB RAM, 512GB SSD)", 85000, 45000, "Like New", 1),
    ]),
    ("electronic", "acer-laptop", "💻", [
        ("Acer Aspire 5 Laptop (Core i5 12th Gen, 8GB RAM, 512GB SSD)", 52000, 36000, "Very Good", 2),
        ("Acer Aspire 3 Laptop (Ryzen 3, 8GB RAM, 256GB SSD)", 33000, 26000, "Good", 3),
        ("Acer Nitro 5 Gaming Laptop (Core i5, GTX 1650, 8GB RAM, 512GB SSD)", 72000, 42000, "Good", 3),
        ("Acer Swift 3 Laptop (Ryzen 5, 16GB RAM, 512GB SSD)", 65000, 38000, "Very Good", 2),
    ]),
    ("electronic", "macbook", "💻", [
        ("Apple MacBook Air M1 Laptop (8GB RAM, 256GB SSD)", 92000, 52000, "Very Good", 3),
        ("Apple MacBook Air M1 Laptop (8GB RAM, 512GB SSD)", 110000, 58000, "Like New", 2),
        ("Apple MacBook Air 2017 Laptop (Core i5, 8GB RAM, 128GB SSD)", 75000, 32000, "Fair", 8),
    ]),
    ("electronic", "msi-laptop", "💻", [
        ("MSI GF63 Thin Gaming Laptop (Core i5 10th Gen, GTX 1650, 8GB RAM, 512GB SSD)", 65000, 38000, "Good", 4),
        ("MSI Modern 14 Laptop (Core i3 12th Gen, 8GB RAM, 512GB SSD)", 45000, 6500, "Very Good", 2),
        ("MSI Katana GF66 Gaming Laptop (Core i7, RTX 3050 Ti, 16GB RAM, 512GB SSD)", 100000, 48000, "Very Good", 3),
    ]),
    ("electronic", "hp-desktop", "🖥️", [
        ("HP Pavilion Desktop PC (Core i5 10th Gen, 8GB RAM, 1TB HDD) with 21.5 inch Monitor", 55000, 6500, "Good", 4),
        ("HP 290 Desktop CPU Tower (Core i3, 4GB RAM, 500GB HDD)", 16000, 5000, "Fair", 5),
    ]),
    ("electronic", "dell-desktop", "🖥️", [
        ("Dell OptiPlex 3080 Desktop CPU Tower (Core i5 10th Gen, 8GB RAM, 256GB SSD)", 48000, 4800, "Good", 4),
        ("Dell Vostro 3888 Desktop PC (Core i3, 8GB RAM, 1TB HDD)", 40000, 6500, "Good", 4),
    ]),
    ("electronic", "lenovo-desktop", "🖥️", [
        ("Lenovo ThinkCentre M70 Desktop PC (Core i5, 8GB RAM, 256GB SSD)", 50000, 6500, "Good", 4),
        ("Lenovo IdeaCentre AIO 3 All-in-One Desktop (Ryzen 5, 8GB RAM, 512GB SSD, 24 inch)", 62000, 6500, "Very Good", 2),
    ]),
    ("electronic", "assembled-pc", "🖥️", [
        ("Assembled Desktop PC (Ryzen 5 3600, 16GB RAM, GTX 1650, 512GB SSD) with Cabinet", 55000, 6500, "Good", 3),
        ("Assembled Gaming Desktop PC (Core i5 12400F, RTX 3060, 16GB RAM, 1TB SSD)", 85000, 45000, "Very Good", 2),
        ("Assembled Desktop PC (Core i3 10th Gen, 8GB RAM, 256GB SSD) Complete Setup with Monitor Keyboard Mouse", 32000, 4800, "Good", 4),
        ("Desktop CPU Tower (Core i5 8th Gen, 8GB RAM, 256GB SSD)", 28000, 3500, "Fair", 6),
        ("Complete Study Setup: Desktop PC with 22 inch Monitor, UPS, Keyboard and Mouse", 45000, 4800, "Good", 4),
    ]),
    ("electronic", "imac", "🖥️", [
        ("Apple iMac 21.5 inch Desktop (Core i5, 8GB RAM, 1TB)", 105000, 6500, "Good", 8),
    ]),
    ("electronic", "monitor", "🖥️", [
        ("Dell 22 inch Full HD Monitor", 9000, 2800, "Good", 3),
        ("LG 24 inch IPS Monitor", 11500, 1200, "Very Good", 2),
        ("HP 24mh 23.8 inch IPS Monitor", 12000, 1200, "Very Good", 3),
        ("Samsung 27 inch Curved Monitor", 18000, 1600, "Good", 3),
        ("Acer 21.5 inch LED Monitor", 7500, 1200, "Fair", 4),
    ]),
    ("electronic", "keyboard", "⌨️", [
        ("Logitech K380 Bluetooth Keyboard", 3000, 850, "Very Good", 2),
        ("Redragon K552 Mechanical Keyboard", 3200, 140, "Good", 2),
        ("HP Wired Keyboard", 800, 100, "Good", 3),
    ]),
    ("electronic", "mouse", "🖱️", [
        ("Logitech M235 Wireless Mouse", 900, 140, "Very Good", 2),
        ("Logitech G102 Gaming Mouse", 1500, 140, "Good", 2),
        ("Dell Wired Optical Mouse", 400, 60, "Good", 3),
    ]),
    ("electronic", "headphones", "🎧", [
        ("boAt Rockerz 450 Bluetooth Headphones", 3000, 260, "Good", 2),
        ("Sony WH-CH510 Wireless Headphones", 4500, 260, "Very Good", 2),
        ("JBL Tune 510BT Wireless Headphones", 3500, 260, "Good", 2),
    ]),
    ("electronic", "earphones", "🎧", [
        ("boAt Bassheads 100 Wired Earphones", 600, 60, "Good", 1),
        ("OnePlus Bullets Z2 Neckband Earphones", 2000, 260, "Very Good", 1),
        ("Realme Buds Air 3 Neo Earbuds", 2500, 260, "Good", 1),
    ]),
    ("electronic", "ssd", "💽", [
        ("Samsung 980 500GB NVMe SSD", 6000, 850, "Like New", 1),
        ("Crucial MX500 500GB SATA SSD", 4500, 690, "Very Good", 2),
        ("Kingston A400 480GB SSD", 3000, 450, "Good", 2),
        ("Samsung T7 500GB Portable SSD", 7500, 280, "Very Good", 1),
    ]),
    ("electronic", "ram", "🧠", [
        ("Crucial 8GB DDR4 3200MHz Laptop RAM Module", 2200, 400, "Good", 2),
        ("Kingston Fury 16GB DDR4 3200MHz Desktop RAM", 4500, 880, "Very Good", 1),
        ("Corsair Vengeance 8GB DDR4 Desktop RAM", 2500, 480, "Good", 2),
    ]),
    ("electronic", "hard-drive", "💾", [
        ("Seagate 1TB Portable Hard Drive", 4500, 280, "Good", 2),
        ("WD Elements 2TB External Hard Drive", 6500, 850, "Very Good", 2),
    ]),
    ("electronic", "usb-drive", "🔌", [
        ("SanDisk 64GB Pen Drive USB 3.0", 600, 113, "Good", 1),
        ("Kingston DataTraveler 128GB USB Drive", 900, 180, "Very Good", 1),
    ]),
    ("electronic", "charger", "🔌", [
        ("Dell 65W Laptop Charger", 2200, 360, "Good", 2),
        ("HP 65W Laptop Charger", 2000, 320, "Good", 2),
        ("Samsung 25W Fast Charger with Cable", 1200, 220, "Very Good", 1),
        ("Apple 20W USB-C Power Adapter", 1900, 400, "Very Good", 1),
    ]),
    ("electronic", "power-bank", "🔋", [
        ("Realme 10000mAh Power Bank", 1299, 650, "Very Good", 4),
        ("Ambrane 20000mAh Power Bank", 2499, 1150, "Like New", 3),
        ("Mi 10000mAh Power Bank 3i", 1499, 700, "Very Good", 3),
        ("boAt PB435 Turbo 35W 20000 mAh Power Bank", 2999, 1350, "Like New", 3),
    ]),
    ("electronic", "printer", "🖨️", [
        ("HP DeskJet 2331 All-in-One Printer", 5500, 750, "Good", 3),
        ("Canon Pixma E477 Wireless Printer", 6500, 900, "Good", 3),
    ]),
    ("electronic", "tablet", "📱", [
        ("Samsung Galaxy Tab A8 Tablet (4GB RAM, 64GB)", 18000, 2800, "Good", 3),
        ("Lenovo Tab M10 Tablet (3GB RAM, 32GB)", 13000, 1800, "Good", 3),
        ("iPad 9th Gen Tablet (64GB, Wi-Fi)", 30000, 4800, "Very Good", 3),
    ]),
    ("electronic", "webcam", "📷", [
        ("Logitech C270 HD Webcam", 2500, 385, "Good", 2),
        ("Full HD 1080p USB Webcam with Mic", 2200, 360, "Good", 2),
    ]),
    ("electronic", "router", "📡", [
        ("TP-Link TL-WR841N Wi-Fi Router", 1300, 240, "Good", 3),
        ("Tenda AC5 Dual Band Wi-Fi Router", 2000, 80, "Good", 2),
    ]),
    ("electronic", "speaker", "🔊", [
        ("JBL Go 2 Bluetooth Speaker", 2500, 420, "Good", 2),
        ("boAt Stone 350 Bluetooth Speaker", 2000, 360, "Good", 2),
    ]),
    ("electronic", "phone", "📱", [
        ("Samsung Galaxy A36 5G", 24999, 14500, "Like New", 3),
        ("iPhone 11 (64GB)", 43900, 18500, "Very Good", 4),
        ("Realme Narzo 50 Mobile Phone (4GB RAM, 64GB)", 12999, 5800, "Good", 3),
        ("Redmi Note 11 Mobile Phone (4GB RAM, 64GB)", 13499, 5200, "Very Good", 4),
    ]),
    ("book", "book-dsa", "📚", [
        ("Data Structures and Algorithms Made Easy", 850, 180, "Good", 0),
        ("Introduction to Algorithms (CLRS)", 1200, 240, "Very Good", 0),
        ("Data Structures Using C by Reema Thareja", 520, 113, "Good", 0),
    ]),
    ("book", "book-dbms", "📚", [
        ("Database System Concepts by Korth", 850, 140, "Good", 0),
        ("Fundamentals of Database Systems by Elmasri and Navathe", 900, 180, "Good", 0),
        ("Database Management Systems by Raghu Ramakrishnan", 800, 180, "Very Good", 0),
    ]),
    ("book", "book-python", "📚", [
        ("Python Crash Course by Eric Matthes", 700, 110, "Very Good", 0),
        ("Learning Python by Mark Lutz", 1200, 140, "Good", 0),
        ("Core Python Programming by Nageswara Rao", 650, 450, "Good", 0),
    ]),
    ("book", "book-java", "📚", [
        ("Java: The Complete Reference by Herbert Schildt", 900, 180, "Good", 0),
        ("Head First Java", 750, 171, "Very Good", 0),
        ("Core Java Volume 1 by Horstmann", 1000, 200, "Good", 0),
    ]),
    ("book", "book-ai", "📚", [
        ("Artificial Intelligence: A Modern Approach by Russell and Norvig", 1100, 240, "Good", 0),
        ("Hands-On Machine Learning by Aurelien Geron", 1500, 320, "Very Good", 0),
        ("Pattern Recognition and Machine Learning by Bishop", 1600, 320, "Good", 0),
        ("Deep Learning by Goodfellow", 1400, 280, "Good", 0),
    ]),
    ("book", "book-os", "📚", [
        ("Operating System Concepts by Galvin", 780, 140, "Good", 0),
        ("Modern Operating Systems by Tanenbaum", 900, 140, "Very Good", 0),
    ]),
    ("book", "book-networks", "📚", [
        ("Computer Networks by Andrew Tanenbaum", 900, 140, "Good", 0),
        ("Data Communications and Networking by Forouzan", 850, 168, "Good", 0),
    ]),
    ("book", "book-general", "📚", [
        ("Let Us C by Yashavant Kanetkar", 450, 90, "Good", 0),
        ("Software Engineering by Roger Pressman", 800, 140, "Good", 0),
        ("Discrete Mathematics and Its Applications by Rosen", 900, 140, "Very Good", 0),
        ("Higher Engineering Mathematics by B.S. Grewal", 600, 90, "Fair", 0),
        ("Digital Electronics by Morris Mano", 500, 113, "Good", 0),
        ("Compilers: Principles and Techniques by Aho and Ullman", 900, 180, "Good", 0),
        ("Engineering Physics by Gaur and Gupta", 450, 90, "Good", 0),
    ]),
    ("study", "study-notes", "📝", [
        ("DSA Handwritten Notes (Complete Syllabus)", 0, 70, "Very Good", 0),
        ("DBMS Handwritten Notes (Units 1 to 5)", 0, 70, "Very Good", 0),
        ("Python Programming Notes with Examples", 0, 70, "Good", 0),
        ("Java Programming Notes (OOP, Collections, Multithreading)", 800, 560, "Good", 0),
        ("Machine Learning Handwritten Notes (Semester 5)", 0, 70, "Very Good", 0),
        ("Operating Systems Notes with Diagrams", 0, 70, "Very Good", 0),
        ("Computer Networks Notes (Unit Wise)", 0, 70, "Good", 0),
        ("Semester 3 CSE Notes Bundle (All Subjects)", 0, 140, "Good", 0),
        ("Semester 4 CSE Notes Bundle (All Subjects)", 0, 140, "Good", 0),
        ("Semester 5 AI and ML Notes Bundle", 0, 140, "Very Good", 0),
    ]),
    ("study", "practical-file", "📓", [
        ("Practical File: Data Structures Lab (C Programs)", 0, 60, "Very Good", 0),
        ("Practical File: DBMS Lab (SQL Programs)", 150, 89, "Very Good", 0),
        ("Practical File: Python Lab with Output", 0, 48, "Good", 0),
        ("Practical File: Java Lab (Completed)", 0, 60, "Good", 0),
        ("Practical File: Computer Networks Lab", 0, 52, "Good", 0),
    ]),
    ("study", "previous-papers", "📄", [
        ("Previous Year Papers: DBMS (Last 5 Years Solved)", 0, 45, "Good", 0),
        ("Previous Year Papers: Operating Systems (Solved)", 0, 45, "Good", 0),
        ("Previous Year Papers: Machine Learning (Solved)", 0, 45, "Good", 0),
        ("Previous Year Papers: Engineering Mathematics (Solved)", 0, 70, "Good", 0),
        ("Placement Preparation Pack (Aptitude and DSA)", 0, 90, "Very Good", 0),
    ]),
    ("calculator", "calculator", "🧮", [
        ("Casio fx-991ES Plus Scientific Calculator", 1250, 180, "Very Good", 0),
        ("Casio fx-991EX ClassWiz Calculator", 1600, 240, "Like New", 0),
        ("Casio fx-82MS Scientific Calculator", 700, 120, "Good", 0),
        ("Casio fx-570ES Plus Calculator", 1100, 140, "Good", 0),
        ("Citizen SR-135N Scientific Calculator", 600, 130, "Good", 0),
    ]),
    ("college", "stationery", "✏️", [
        ("Stationery Combo (Pens, Highlighters, Notebooks)", 500, 90, "Very Good", 0),
        ("Geometry Box Set", 250, 45, "Good", 0),
        ("A3 Drawing Board with Clip", 300, 110, "Good", 0),
        ("Lab Record Files Pack (5 Files)", 400, 60, "Good", 0),
    ]),
    ("college", "drawing-kit", "📐", [
        ("Engineering Drawing Kit (Drafter, Set Squares, Compass)", 650, 110, "Good", 0),
        ("Mini Drafter with Scale", 350, 110, "Good", 0),
    ]),
    ("college", "bag", "🎒", [
        ("Wildcraft Backpack 30L", 1800, 360, "Good", 0),
        ("Laptop Bag 15.6 inch", 1200, 220, "Good", 0),
        ("American Tourister College Backpack", 2200, 385, "Very Good", 0),
    ]),
    ("college", "lab-coat", "🥼", [
        ("Lab Coat (Size M)", 450, 200, "Good", 0),
        ("Lab Coat (Size L)", 450, 200, "Good", 0),
    ]),
    ("college", "arduino-board", "🤖", [
        ("Arduino Uno R3 Board with USB Cable", 800, 110, "Very Good", 0),
        ("Arduino Mega 2560 Board", 1500, 110, "Good", 0),
        ("ESP32 Development Board (WiFi and Bluetooth)", 600, 110, "Very Good", 0),
        ("ESP8266 NodeMCU WiFi Board", 400, 110, "Good", 0),
        ("Raspberry Pi 4 Model B (4GB) with Case and Adapter", 6500, 1140, "Very Good", 0),
        ("Raspberry Pi 3 Model B+ with Power Supply", 4500, 690, "Good", 0),
    ]),
    ("college", "arduino-kit", "🔧", [
        ("Arduino Starter Kit (Uno, Breadboard, Sensors, LEDs, Jumper Wires)", 2500, 110, "Very Good", 0),
        ("Sensor Kit (37 in 1) for Arduino", 1500, 280, "Good", 0),
        ("Ultrasonic Sensor HC-SR04 and Servo Motor Combo", 400, 81, "Good", 0),
        ("Breadboard and Jumper Wire Combo (830 Points)", 400, 110, "Good", 0),
        ("Relay Module and IR Sensor Combo Pack", 500, 90, "Good", 0),
        ("DC Motor and L298N Motor Driver Combo", 500, 99, "Good", 0),
        ("16x2 LCD Display with I2C Module", 300, 54, "Very Good", 0),
    ]),
    ("college", "electronics-tools", "🛠️", [
        ("Soldering Iron Kit with Stand and Solder", 800, 140, "Good", 0),
        ("Digital Multimeter DT830B", 600, 135, "Good", 0),
    ]),
    ("hostel", "lamp", "💡", [
        ("Rechargeable LED Table Lamp", 900, 160, "Very Good", 0),
        ("Study Desk Lamp with Clip", 600, 113, "Good", 0),
    ]),
    ("hostel", "kitchen", "☕", [
        ("Electric Kettle 1 Litre", 1000, 180, "Good", 0),
        ("Induction Cooktop 1800W", 2500, 420, "Good", 0),
        ("Lunch Box Set (3 Containers)", 500, 90, "Good", 0),
        ("Bucket and Mug Set", 250, 45, "Good", 0),
    ]),
    ("hostel", "bedding", "🛏️", [
        ("Single Bed Mattress (4 inch)", 3500, 450, "Good", 0),
        ("Pillow, Bedsheet and Blanket Set", 1800, 190, "Very Good", 0),
    ]),
    ("hostel", "appliance", "❄️", [
        ("Mini Fridge 90 Litre", 9000, 1350, "Good", 0),
        ("Table Fan 400mm", 1800, 280, "Good", 0),
        ("Room Heater 1000W", 1500, 240, "Good", 0),
        ("Personal Cooler 18 Litre", 5500, 580, "Good", 0),
        ("Steam Iron 1000W", 900, 140, "Good", 0),
    ]),
    ("hostel", "furniture", "🪑", [
        ("Foldable Study Table", 2200, 280, "Good", 0),
        ("Plastic Chair (Armless)", 700, 120, "Good", 0),
        ("Study Chair with Back Support", 3500, 280, "Very Good", 0),
        ("Wooden Bookshelf (4 Tier)", 3200, 140, "Good", 0),
        ("Metal Storage Cabinet (3 Shelves)", 4500, 700, "Good", 0),
    ]),
    ("hostel", "hostel-misc", "🔌", [
        ("Extension Board 4 Socket with Switch", 400, 110, "Good", 0),
        ("Cloth Drying Stand (Foldable)", 900, 180, "Good", 0),
        ("Wall Clock", 300, 54, "Good", 0),
    ]),
    ("sport", "badminton", "🏸", [
        ("Yonex Muscle Power 29 Badminton Racket", 1800, 250, "Good", 0),
        ("Li-Ning Smash XP 80 Badminton Racket", 1600, 250, "Good", 0),
        ("Badminton Racket Pair with Cover", 1100, 200, "Very Good", 0),
        ("Yonex Mavis 350 Nylon Shuttlecocks (Tube of 6)", 800, 158, "Like New", 0),
    ]),
    ("sport", "cricket", "🏏", [
        ("Complete Cricket Kit (Bat, Pads, Gloves, Helmet) Adult", 6500, 250, "Good", 0),
        ("Kashmir Willow Cricket Bat", 1400, 240, "Good", 0),
    ]),
    ("sport", "football", "⚽", [
        ("Nivia Football (Size 5)", 700, 120, "Good", 0),
    ]),
    ("sport", "bicycle", "🚲", [
        ("Hero Sprint Mountain Bike 26T (21 Gears)", 9500, 950, "Good", 0),
        ("Hercules Roadeo Bicycle 26T", 6500, 950, "Good", 0),
    ]),
    ("sport", "sports-shoes", "👟", [
        ("Nike Running Shoes (UK 8)", 4500, 450, "Good", 0),
        ("Adidas Sports Shoes (UK 9)", 3800, 450, "Good", 0),
    ]),
    ("sport", "fitness", "🏋️", [
        ("Yoga Mat 6mm Anti-Slip", 800, 120, "Very Good", 0),
        ("Adjustable Dumbbell Set (10 kg)", 1800, 280, "Good", 0),
        ("Resistance Bands Set", 500, 80, "Very Good", 0),
    ]),
    ("other", "guitar", "🎸", [
        ("Acoustic Guitar with Bag", 4500, 750, "Good", 0),
        ("Ukulele with Cover", 1800, 320, "Very Good", 0),
    ]),
    ("other", "games", "♟️", [
        ("Chess Set (Folding Board)", 500, 110, "Good", 0),
        ("Carrom Board with Coins", 1800, 110, "Good", 0),
    ]),
    ("other", "daily-use", "☂️", [
        ("Umbrella (Large, Windproof)", 600, 80, "Good", 0),
        ("Steel Water Bottle 1 Litre", 500, 60, "Very Good", 0),
        ("Winter Jacket (Size M)", 2500, 450, "Good", 0),
        ("Hoodie (Size L)", 1200, 380, "Good", 0),
    ]),
]

PHOTO_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp", ".svg")


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def build_items(seed=42):
    rng = random.Random(seed)
    items = []
    for keywords, group, emoji, entries in SECTIONS:
        for title, original, price, condition, age in entries:
            details = []
            purchase_year = THIS_YEAR - age if age else None
            if purchase_year:
                years_used = THIS_YEAR - purchase_year
                listed_days = rng.randint(1, 30)
                listed_str = (
                    f"{listed_days} day{'s' if listed_days > 1 else ''} ago"
                    if listed_days <= 7
                    else f"{listed_days // 7} week{'s' if listed_days // 7 > 1 else ''} ago"
                )
                details.append(
                    f"Purchased in {purchase_year}. Used for "
                    f"{years_used} year{'s' if years_used > 1 else ''}. "
                    f"Listed {listed_str}."
                )
            else:
                listed_days = rng.randint(1, 10)
                listed_str = f"{listed_days} day{'s' if listed_days > 1 else ''} ago"
                details.append(f"Listed {listed_str}.")
            details.append(rng.choice(PHRASES))
            items.append({
                "keywords": keywords.split("|"),
                "group": group,
                "emoji": emoji,
                "product_name": title,
                "description": f"{title}. {' '.join(details)}",
                "price": price,
                "original_price": original or None,
                "product_condition": condition,
                "created_at": datetime.now() - timedelta(days=rng.randint(0, 40), hours=rng.randint(0, 23)),
            })
    return items
def find_photo(title, group):
    for key in (slugify(title), group):
        for extension in PHOTO_EXTENSIONS:
            path = os.path.join(PHOTO_DIR, key + extension)
            if os.path.isfile(path) and os.path.getsize(path) <= 5 * 1024 * 1024:
                return path
    return None


def make_svg(emoji, title, keyword):
    start, end = PALETTES.get(keyword, PALETTES["other"])
    short = title if len(title) <= 34 else title[:31] + "..."
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">'
        f'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{start}"/>'
        f'<stop offset="1" stop-color="{end}"/></linearGradient></defs>'
        '<rect width="600" height="450" fill="url(#g)"/>'
        f'<text x="300" y="240" font-size="150" text-anchor="middle">{emoji}</text>'
        f'<text x="300" y="375" font-size="26" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif">{escape(short)}</text>'
        '</svg>'
    )


def write_photo_list():
    os.makedirs(PHOTO_DIR, exist_ok=True)
    lines = ["Put real photos here. Name = group key (below) or the product title slug, with .jpg .png or .webp.",
             "A group photo is used for every product of that group. A title-slug photo is used for that product only.", ""]
    for _keywords, group, _emoji, entries in SECTIONS:
        lines.append(f"{group}    e.g. {entries[0][0]}    (title slug: {slugify(entries[0][0])})")
    with open(os.path.join(PHOTO_DIR, "PHOTO_LIST.txt"), "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines) + "\n")


def main():
    from dotenv import load_dotenv
    from sqlalchemy import create_engine, text

    load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)
    base_url = os.getenv("PUBLIC_BASE_URL", "http://127.0.0.1:5000").rstrip("/")
    engine = create_engine(os.getenv("DATABASE_URL"))
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    write_photo_list()

    with engine.begin() as connection:
        connection.execute(text(
            "DELETE FROM cc_wishlists WHERE product_id IN (SELECT product_id FROM products WHERE description LIKE :mark)"
        ), {"mark": f"%{MARK}%"})
        removed = connection.execute(
            text("DELETE FROM products WHERE description LIKE :mark"), {"mark": f"%{MARK}%"}
        ).rowcount
        for name in os.listdir(UPLOAD_DIR):
            if name.startswith("demo-"):
                os.remove(os.path.join(UPLOAD_DIR, name))
        print(f"Removed {removed} old demo products.")

        if "--remove" in sys.argv:
            return

        columns = {row[0] for row in connection.execute(text(
            "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS "
            "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products'"
        ))}
        categories = [row[0] for row in connection.execute(text("SELECT category_name FROM categories"))]
        sellers = connection.execute(text("SELECT user_id, college FROM users ORDER BY user_id")).fetchall()

        if not sellers:
            print("No user found. Register an account on the website first, then run this again.")
            return

        counts, skipped, real_photos, missing_groups = {}, set(), 0, set()
        for index, item in enumerate(build_items()):
            category = None
            for keyword in item["keywords"]:
                category = next((c for c in categories if keyword in c.lower()), None)
                if category:
                    break
            if not category:
                skipped.add("|".join(item["keywords"]))
                continue

            digest = hashlib.md5(item["product_name"].encode("utf-8")).hexdigest()[:12]
            photo = find_photo(item["product_name"], item["group"])
            if photo:
                filename = f"demo-{digest}{os.path.splitext(photo)[1].lower()}"
                shutil.copyfile(photo, os.path.join(UPLOAD_DIR, filename))
                real_photos += 1
            else:
                filename = f"demo-{digest}.svg"
                with open(os.path.join(UPLOAD_DIR, filename), "w", encoding="utf-8") as handle:
                    handle.write(make_svg(item["emoji"], item["product_name"], item["keywords"][0]))
                missing_groups.add(item["group"])

            seller = sellers[index % len(sellers)]
            values = {
                "product_name": item["product_name"],
                "category": category,
                "description": f"{item['description']} {MARK}",
                "price": item["price"],
                "original_price": item["original_price"],
                "product_condition": item["product_condition"],
                "seller_id": seller[0],
                "college": seller[1] or "AKS University",
                "image_url": f"{base_url}/uploads/{filename}",
                "status": "available",
                "created_at": item["created_at"],
            }
            values = {k: v for k, v in values.items() if k in columns}
            names = ", ".join(f"`{k}`" for k in values)
            marks = ", ".join(f":{k}" for k in values)
            connection.execute(text(f"INSERT INTO products ({names}) VALUES ({marks})"), values)
            counts[category] = counts.get(category, 0) + 1

        for category, count in sorted(counts.items()):
            print(f"  {category}: {count}")
        print(f"Added {sum(counts.values())} demo products from {len(sellers)} seller account(s).")
        print(f"Real photos used: {real_photos}. Cards without a real photo: {sum(counts.values()) - real_photos}.")
        if missing_groups:
            print("Photo groups still using auto cards (see product_photos/PHOTO_LIST.txt):")
            print("  " + ", ".join(sorted(missing_groups)))
        for keyword in skipped:
            print(f"Skipped items: no category containing '{keyword}'.")


if __name__ == "__main__":
    main()
