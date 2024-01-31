-- Insert test data into Users
INSERT INTO Users (Email, Password, Role, Name, ContactInfo) VALUES
('applicant@example.com', 'hashedpassword', 'Applicant', 'Alice Example', '555-0100'),
('recruiter@example.com', 'hashedpassword', 'Recruiter', 'Bob Example', '555-0200'),
('web@example.com', 'hashedpassword', 'Applicant', 'From web', '555-0300');

-- Insert test data into JobPositions
INSERT INTO JobPositions (Title, Description, Requirements, Department) VALUES
('Roller Coaster Operator', 'Operate roller coaster rides and ensure safety.', 'Previous experience in amusement park operations.', 'Rides'),
('Costume Character', 'Perform as a costume character, interact with guests.', 'Acting experience required, must handle costumes with care.', 'Entertainment');

-- Insert test data into Applications
INSERT INTO Applications (UserID, PositionID, Status, SubmissionDate) VALUES
(1, 1, 'Pending', '2024-01-30 09:00:00'),
(1, 2, 'Pending', '2024-01-30 10:00:00');

-- Insert test data into CompetenceProfiles
INSERT INTO CompetenceProfiles (UserID, Skill, ExperienceLevel) VALUES
(1, 'Customer Service', 5),
(1, 'Safety Management', 4);

-- Insert test data into Availability
INSERT INTO Availability (UserID, StartDate, EndDate) VALUES
(1, '2024-06-01', '2024-08-31');

-- Insert test data into Interviews
INSERT INTO Interviews (ApplicationID, InterviewDate, InterviewerID, Outcome) VALUES
(1, '2024-02-10 14:00:00', 2, 'Pending');


