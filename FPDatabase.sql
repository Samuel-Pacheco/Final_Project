-- Creating tables
-- Meteorites
CREATE TABLE Meteorite_info (
	meteorite_name VARCHAR(100) NOT NULL,
	recclass VARCHAR(100),
	mass_g FLOAT8 NOT NULL,
	impact_year INT NOT NULL,
	PRIMARY KEY (meteorite_name)
);

CREATE TABLE Meteorite_location (
	meteorite_name VARCHAR(100) NOT NULL,
	retclat  FLOAT8 NOT NULL,
	reclong  FLOAT8 NOT NULL,
	PRIMARY KEY (meteorite_name)
);

CREATE TABLE Meteorite_final (
	meteorite_name VARCHAR(100) NOT NULL,
	recclass VARCHAR(100),
	mass_g FLOAT8 NOT NULL,
	impact_year INT NOT NULL,
	retclat  FLOAT8 NOT NULL,
	reclong  FLOAT8 NOT NULL,
	PRIMARY KEY (meteorite_name)
);
