-- Truncate tables in reverse order of dependencies to avoid constraint issues
-- Start with tables that are referenced by others
TRUNCATE TABLE reply CASCADE;
TRUNCATE TABLE feedback CASCADE;
TRUNCATE TABLE "user" CASCADE;
TRUNCATE TABLE company CASCADE;
TRUNCATE TABLE category CASCADE;
TRUNCATE TABLE "status" CASCADE;

-- Reset sequences for SERIAL columns after TRUNCATE 
ALTER SEQUENCE category_idcategory_seq RESTART WITH 1;
ALTER SEQUENCE company_idcompany_seq RESTART WITH 1;
ALTER SEQUENCE user_iduser_seq RESTART WITH 1;
ALTER SEQUENCE feedback_idfeedback_seq RESTART WITH 1;
ALTER SEQUENCE status_idStatus_seq RESTART WITH 1;
ALTER SEQUENCE reply_idreply_seq RESTART WITH 1;

-- Populate the category table (no dependencies)
INSERT INTO category (typeCategory, colorCategory) VALUES
('Product Quality', '#4CAF50'),      
('Customer Service', '#2196F3'),
('Website Usability', '#FF9800'),
('Delivery Speed', '#9C27B0'),
('Pricing', '#F44336'),
('Bug Report', '#795548'),
('Feature Request', '#607D8B'),
('General Feedback', '#9E9E9E');


-- Populate the status table (no dependencies)
INSERT INTO "status" (typeStatus, colorStatus) VALUES
('Pending', '#FF9800'),
('In Progress', '#2196F3'),
('Solved', '#4CAF50'),
('Closed', '#9E9E9E'),
('Rejected', '#F44336');

-- Populate the company table (no dependencies)
INSERT INTO company (nameCompany, emailCompany, CNPJCompany) VALUES
('EchoBox Solutions', 'contact@echobox.com', '12345678000100'),
('Tech Innovations Inc.', 'info@techinnovations.com', '98765432000199'),
('Global Services Ltd.', 'support@globalservices.com', '11223344000155'),
('Local Business Co.', 'hello@localbusiness.co', '55667788000122'),
('Digital Solutions', 'contact@digitalsolutions.com', '99887766000144'),
('Customer First Corp', 'support@customerfirst.com', '33445566000177');

-- Populate the "user" table (depends on company)
-- Assuming company IDs are 1, 2, 3, 4, 5, 6 after TRUNCATE and RESTART
INSERT INTO "user" (emailUser, passwordUser, fk_user_idCompany) VALUES
('admin@echobox.com', 'admin123', 1),
('alice@techinnovations.com', 'password123', 2),
('bob@globalservices.com', 'securepass', 3),
('diana@localbusiness.com', 'userpass', 4),
('charlie@digitalsolutions.com', 'mypassword', 5),
('eva@customerfirst.com', 'strongpass', 6),
('john@echobox.com', 'testpass', 1),
('sarah@techinnovations.com', 'devpass', 2);

-- Populate the feedback table (depends on user, company, category, status)
-- Assuming user IDs are 1-8, company IDs are 1-6, category IDs are 1-8, and status IDs are 1-5 after TRUNCATE and RESTART
INSERT INTO feedback (titleFeedback, reviewFeedback, fk_feedback_idUser, fk_feedback_idCompany, fk_feedback_idCategory, fk_feedback_idStatus) VALUES
('Excellent Product Quality!', 'The product exceeded my expectations in terms of quality and features. Very satisfied with the purchase.', 2, 1, 1, 3),
('Slow Customer Support Response', 'Took several days to get a response from customer support. Could be improved.', 3, 2, 2, 2),
('Website Navigation Issues', 'I had trouble finding the information I needed on the website. The navigation could be more intuitive.', 4, 1, 3, 1),
('Lightning Fast Delivery', 'Received my order much faster than expected. Great logistics!', 5, 3, 4, 3),
('Competitive Pricing', 'The pricing is very competitive for the features offered. Good value for money.', 6, 4, 5, 3),
('Bug in Mobile App', 'Found a critical bug when using the mobile app on Android. Unable to complete checkout.', 7, 1, 6, 2),
('Feature Request: Dark Mode', 'Would love to see a dark mode option in the application. It would greatly improve user experience.', 8, 1, 7, 1),
('Overall Great Experience', 'Had a wonderful experience with your service. Keep up the good work!', 1, 1, 8, 3),
('Payment Process Too Complex', 'The payment process has too many steps. Could be simplified for better user experience.', 2, 2, 3, 2),
('Product Documentation Needs Work', 'The product documentation is incomplete and could use more examples.', 3, 3, 1, 1),
('Awesome Customer Service', 'The customer service team was extremely helpful and resolved my issue quickly.', 4, 4, 2, 3),
('Delivery Packaging Excellent', 'Items arrived in perfect condition thanks to excellent packaging.', 5, 5, 4, 3);

-- Populate the reply table (depends on feedback and user)
-- Adding some replies to existing feedback
INSERT INTO reply (titleReply, reviewReply, fk_reply_idFeedback, fk_reply_idUser) VALUES
('Thank you for your feedback!', 'We really appreciate your positive review. We''re glad you''re satisfied with our product quality.', 1, 1),
('We''re working on it', 'Thank you for bringing this to our attention. We''re currently working on improving our response times.', 2, 1),
('Navigation improvements coming soon', 'We''ve noted your feedback and are planning a website redesign to improve navigation.', 3, 1),
('Great to hear!', 'We''re happy that our delivery service met your expectations. Thank you for the feedback!', 4, 1),
('Bug fix in progress', 'We''ve identified the issue and our development team is working on a fix. Update coming soon.', 6, 7),
('Dark mode under consideration', 'This is a popular request! We''re evaluating the implementation of dark mode for our next major update.', 7, 1),
('Payment process review', 'We''re reviewing our payment flow based on user feedback. Simplification is a priority.', 9, 1);