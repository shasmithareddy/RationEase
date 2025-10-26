-- Delete ALL existing tokens for the shop
DELETE FROM tokens WHERE shop_id = '2c61f3ab-f3ac-485a-8a4c-f829401a2bee';

-- Insert 5 completed tokens for October 27, 2024
INSERT INTO tokens (shop_id, token_number, customer_name, customer_phone, status, created_at, completed_at) VALUES
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 1, 'Lakshmi Devi', '+919876543201', 'completed', '2024-10-27 09:00:00', '2024-10-27 09:08:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 2, 'Rajesh Kumar', '+919876543202', 'completed', '2024-10-27 09:05:00', '2024-10-27 09:15:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 3, 'Priya Sharma', '+919876543203', 'completed', '2024-10-27 09:10:00', '2024-10-27 09:22:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 4, 'Arjun Reddy', '+919876543204', 'completed', '2024-10-27 09:15:00', '2024-10-27 09:28:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 5, 'Meena Patel', '+919876543205', 'completed', '2024-10-27 09:20:00', '2024-10-27 09:35:00');

-- Insert 25 waiting tokens for October 27, 2024
INSERT INTO tokens (shop_id, token_number, customer_name, customer_phone, status, created_at) VALUES
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 6, 'Suresh Babu', '+919876543206', 'waiting', '2024-10-27 09:25:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 7, 'Divya Rao', '+919876543207', 'waiting', '2024-10-27 09:30:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 8, 'Karthik Iyer', '+919876543208', 'waiting', '2024-10-27 09:35:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 9, 'Anusha Nair', '+919876543209', 'waiting', '2024-10-27 09:40:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 10, 'Vijay Murugan', '+919876543210', 'waiting', '2024-10-27 09:45:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 11, 'Kavitha Menon', '+919876543211', 'waiting', '2024-10-27 09:50:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 12, 'Arun Kumar', '+919876543212', 'waiting', '2024-10-27 09:55:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 13, 'Pooja Vyas', '+919876543213', 'waiting', '2024-10-27 10:00:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 14, 'Ramesh Pillai', '+919876543214', 'waiting', '2024-10-27 10:05:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 15, 'Shalini Reddy', '+919876543215', 'waiting', '2024-10-27 10:10:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 16, 'Ganesh Subramanian', '+919876543216', 'waiting', '2024-10-27 10:15:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 17, 'Deepa Krishnan', '+919876543217', 'waiting', '2024-10-27 10:20:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 18, 'Prakash Bhat', '+919876543218', 'waiting', '2024-10-27 10:25:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 19, 'Sneha Joshi', '+919876543219', 'waiting', '2024-10-27 10:30:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 20, 'Murali Mohan', '+919876543220', 'waiting', '2024-10-27 10:35:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 21, 'Suma Ravi', '+919876543221', 'waiting', '2024-10-27 10:40:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 22, 'Bala Chandran', '+919876543222', 'waiting', '2024-10-27 10:45:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 23, 'Radha Krishnan', '+919876543223', 'waiting', '2024-10-27 10:50:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 24, 'Senthil Kumar', '+919876543224', 'waiting', '2024-10-27 10:55:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 25, 'Geetha Ramesh', '+919876543225', 'waiting', '2024-10-27 11:00:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 26, 'Venkat Swamy', '+919876543226', 'waiting', '2024-10-27 11:05:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 27, 'Nalini Devi', '+919876543227', 'waiting', '2024-10-27 11:10:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 28, 'Ravi Shankar', '+919876543228', 'waiting', '2024-10-27 11:15:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 29, 'Vasanthi Amma', '+919876543229', 'waiting', '2024-10-27 11:20:00'),
('2c61f3ab-f3ac-485a-8a4c-f829401a2bee', 30, 'Mohan Das', '+919876543230', 'waiting', '2024-10-27 11:25:00');