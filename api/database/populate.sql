-- Truncate tables in reverse order of dependencies to avoid constraint issues
-- Start with tables that are referenced by others
TRUNCATE TABLE feedback CASCADE;
TRUNCATE TABLE "user" CASCADE;
TRUNCATE TABLE company CASCADE;
TRUNCATE TABLE category CASCADE;
TRUNCATE TABLE status CASCADE;

-- Reset sequences for SERIAL columns after TRUNCATE 
ALTER SEQUENCE category_idcategory_seq RESTART WITH 1;
ALTER SEQUENCE company_idcompany_seq RESTART WITH 1;
ALTER SEQUENCE user_iduser_seq RESTART WITH 1;
ALTER SEQUENCE feedback_idfeedback_seq RESTART WITH 1;
ALTER SEQUENCE status_idStatus_seq RESTART WITH 1;

-- Populate the category table (no dependencies)
INSERT INTO category (typeCategory) VALUES
('Product Quality'),
('Customer Service'),
('Website Usability'),
('Delivery Speed'),
('Pricing');

-- Populate the status table (no dependencies)
INSERT INTO "status" (typeStatus) VALUES
('In Progress'),
('Solved'),
('Paused');

-- Populate the company table (no dependencies)
INSERT INTO company (nameCompany, emailCompany, CNPJCompany) VALUES
('Tech Solutions Inc.', 'contact@techsolutions.com', '12345678000100'),
('Global Innovations Ltd.', 'info@globalinnovations.com', '98765432000199'),
('Local Services Co.', 'support@localservices.co', '11223344000155');

-- Populate the "user" table (depends on company)
-- Assuming company IDs are 1, 2, 3 after TRUNCATE and RESTART
INSERT INTO "user" (emailUser, passwordUser, fk_user_idCompany) VALUES
('alice@techsolutions.com', 'password123', 1), -- Replace with hashed passwords in real app
('bob@globalinnovations.com', 'securepass', 2),
('charlie@techsolutions.com', 'pass123word', 1),
('diana@localservices.com', 'anotherpass', 3);

-- Populate the feedback table (depends on user, company, category, status)
-- Assuming user IDs are 1, 2, 3, 4, category IDs are 1, 2, 3, 4, 5, and status IDs are 1, 2, 3 after TRUNCATE and RESTART
INSERT INTO feedback (titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus) VALUES
('Great Product!', 'The product exceeded my expectations in terms of quality and features.', 1, 1, 1, 1),
('Slow Support Response', 'Took several days to get a response from customer support.', 2, 2, 2, 2),
('Website is confusing', 'I had trouble finding the information I needed on the website.', 3, 1, 3, 3),
('Fast Delivery', 'Received my order much faster than expected.', 4, 3, 1, 1),
('Good Value', 'The pricing is very competitive for the features offered.', 1, 1, 2, 2);