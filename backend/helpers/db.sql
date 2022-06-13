CREATE TABLE todo(
    id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    uid INTEGER
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    uname VARCHAR(255),
    pword VARCHAR(255)
);

CREATE DATABASE tic_tac_toe;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) unique,
    password VARCHAR(255),
    loginCount INTEGER default 1,
    winCount INTEGER default 0
);

CREATE TABLE rooms(
    id SERIAL PRIMARY KEY,
    roomCode VARCHAR(255) unique,
    player1 VARCHAR(255),
    player2 VARCHAR(255),
    turn integer default 1
);

update users set loginCount = loginCount + 1 where id=1;
UPDATE rooms SET player1=player2, player2=null WHERE player1=$1;
UPDATE rooms SET player2=null WHERE player2=$1;
