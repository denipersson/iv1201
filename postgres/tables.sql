CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(50) CHECK (Role IN ('Applicant', 'Recruiter')),
    Name VARCHAR(255),
    ContactInfo VARCHAR(255)
);


CREATE TABLE JobPositions (
    PositionID SERIAL PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    Requirements TEXT,
    Department VARCHAR(255),
    CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Applications (
    ApplicationID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    PositionID INT NOT NULL,
    Status VARCHAR(50) NOT NULL CHECK (Status IN ('Pending', 'Reviewed', 'Accepted', 'Rejected')),
    SubmissionDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (PositionID) REFERENCES JobPositions(PositionID)
);

CREATE TABLE CompetenceProfiles (
    ProfileID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    Skill VARCHAR(255) NOT NULL,
    ExperienceLevel INT CHECK (ExperienceLevel BETWEEN 1 AND 10),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Availability (
    AvailabilityID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Interviews (
    InterviewID SERIAL PRIMARY KEY,
    ApplicationID INT NOT NULL,
    InterviewDate TIMESTAMP WITH TIME ZONE NOT NULL,
    InterviewerID INT,
    Outcome VARCHAR(255),
    FOREIGN KEY (ApplicationID) REFERENCES Applications(ApplicationID),
    FOREIGN KEY (InterviewerID) REFERENCES Users(UserID)
);

