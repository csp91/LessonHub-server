
CREATE TABLE IF NOT EXISTS "user" (
  id           bigserial    PRIMARY KEY CHECK (id > 0),
  first        varchar(64)  NOT NULL,
  last         varchar(64)  NOT NULL,
  email        varchar(128) UNIQUE NOT NULL
);

CREATE TYPE grade_type AS ENUM (
  'PK',
  'K',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12'
);

CREATE TABLE IF NOT EXISTS "lesson" (
  id            bigserial        PRIMARY KEY CHECK (id > 0),
  title 	    	varchar		    	 NOT NULL,
  "description"	varchar          NOT NULL,
  grade         grade_type       NOT NULL,
  author_id   	bigint		    	 NOT NULL,
  created_at    timestamp        DEFAULT now(),
	
  FOREIGN KEY (author_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item (
  id            bigserial        PRIMARY KEY CHECK (id > 0),
  lesson_id     bigserial        NOT NULL,
  "name" 	      varchar	    		 NULL,
  "file"	    	bytea		      	 NOT NULL,
	
  FOREIGN KEY (lesson_id) REFERENCES "lesson"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rating (
  id            bigserial        PRIMARY KEY CHECK (id > 0),
  lesson_id     bigserial        NOT NULL,
  author_id     bigserial        NOT NULL,
  rate 			int  			 NOT NULL,
  comment		text			 NOT NULL,
	
  FOREIGN KEY (lesson_id) REFERENCES "lesson"(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES "user"(id) ON DELETE CASCADE,
  CHECK (rate BETWEEN 1 AND 5)
);
