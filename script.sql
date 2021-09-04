CREATE TABLE "fantateams" (
	"id"	SERIAL,
	"name"	TEXT NOT NULL,
	"credits"	INTEGER NOT NULL,
	"p"	INTEGER NOT NULL,
	"d"	INTEGER NOT NULL,
	"c"	INTEGER NOT NULL,
	"a"	INTEGER NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE "player" (
	"id"	INTEGER,
	"role"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"team"	TEXT NOT NULL,
	"qi"    INTEGER,
	PRIMARY KEY("id")
);

CREATE TABLE "purchase" (
	"id"	INTEGER NOT NULL,
	"fantateams"	INTEGER NOT NULL,
	"price"	INTEGER NOT NULL,
	FOREIGN KEY("id") REFERENCES "player"("id"),
	PRIMARY KEY("id"),
	FOREIGN KEY("fantateams") REFERENCES "fantateams"("id")
);

CREATE TABLE "users" (
	"id"	SERIAL,
	"username"	TEXT NOT NULL,
	"hash"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	PRIMARY KEY("id")
);

insert into fantateams values(1,'luigi',500,0,0,0,0);
insert into fantateams values(2,'niccolo',500,0,0,0,0);
insert into fantateams values(3,'mario',500,0,0,0,0);
insert into fantateams values(4,'checco',500,0,0,0,0);
insert into fantateams values(5,'fabio',500,0,0,0,0);
insert into fantateams values(6,'manuel',500,0,0,0,0);
insert into fantateams values(7,'bruno',500,0,0,0,0);
insert into fantateams values(8,'cri',500,0,0,0,0);
insert into fantateams values(9,'zolfa',500,0,0,0,0);
insert into fantateams values(10,'marco',500,0,0,0,0);
insert into users values(1,'apc.luigi@gmail.com','$2a$10$WRTyL4FDbnS3Khe8dAwf.uBQmVYuJHnjD.PzgcQVmdLxJAzWCtfX2','luigi');
