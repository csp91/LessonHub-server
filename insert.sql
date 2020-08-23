
INSERT INTO "user" (first, last, email)
VALUES ('John', 'Doe', 'john.doe@yahoo.com'),
	   ('Anna', 'Belle', 'creepydoll@thriller.com'),
	   ('Donald', 'Duck', 'ihaterabbits@looney.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO "lesson" (title, description, grade, author_id)
VALUES ('How to do addition', 'Math is fun! Learn how to combine and count numbers.', '2', 1 ),
('Learn subtraction with negative numbers', 'An example of negative numbers in real life is debt!', '3', 2 ),
('Play and learn', 'Play to complete this racing game while also learn at the same time as you pass other racers.', '2', 3 );

INSERT INTO "item" (lesson_id, name, file)
VALUES (1, 'Addition.jpg', ),
('Learn subtraction with negative numbers', 'An example of negative numbers in real life is debt!', '3', 2 ),
('Play and learn', 'Play to complete this racing game while also learn at the same time as you pass other racers.', '2', 3 );

