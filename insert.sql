
-- CREATE TYPE grade_type AS ENUM (
--   'PK',
--   'K',
--   '1',
--   '2',
--   '3',
--   '4',
--   '5',
--   '6',
--   '7',
--   '8',
--   '9',
--   '10',
--   '11',
--   '12'
-- );

-- CREATE TYPE cat_type AS ENUM (
--   'English',
--   'Math',
--   'History',
--   'Science',
--   'Technology',
--   'Fitness',
--   'SS',
--   'FL'
-- );



INSERT INTO "user" (first, last, phone, email)
VALUES ('John', 'Doe', '1234567890' ,'john.doe@yahoo.com'),
	   ('Anna', 'Belle', '1234554555' ,'creepydoll@thriller.com'),
	   ('Donald', 'Duck', '1234123412' ,'ihaterabbits@looney.com'),
	   ('Gerald', 'Rieng', '1234567899','blitzkrieg@notanazi.com'),
	   ('Chris', 'Hemmingsworth', '0987654321', 'notCptUSA@hailhydra.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO "lesson" (title, description, grade, category, notes, author_id)
VALUES ('How to do addition', 'Math is fun! Learn how to combine and count numbers.', '2', 'Math', 'Learn basic .... ', 1 ),
	('How to do subtraction', 'Math is still fun! Learn how to remove numbers.', '3', 'Math', 'Learn basic .... ', 2),
	('How to do division', 'Math is kinda fun! Learn how to un-multiply numbers.', '4', 'Math', 'Learn basic....', 3),
	('How to do algebra', 'Math is not fun anymore, starting here.', '8', 'Math', 'Learn basic...', 4),
	('How to do theoretical calculations', 'How did you even get to this point in math???', '12', 'Math', 'Learn... something...', 5)
	;

	
-- rate is 1-5
INSERT INTO rating (lesson_id, author_id, rate, comment)
VALUES (1, 1, 4, 'Really good!'),
	(2, 2, 2, 'Not all that great...'),
	(3, 1, 3, 'My kids had difficulties getting into the lesson.'),
	(4, 5, 1, 'Hard for kids to get into, they got lost really quick.'),
	(5, 5, 5, 'Not boosting my own ratings or anything. Promise.')
	;

