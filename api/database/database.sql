-- Enable pgcrypto extension for password hashing (Not really sure how extensions really work)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- drops thje tables dynamically because postgres doesnt let you just do drop database

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        RAISE NOTICE 'Dropping table w/ CASCADE: %', '"' || r.tablename || '"';
        EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
    END LOOP;
END;
$$;

-- tables are created here, some table names them have "" around them, thats because they are reserved keywords

CREATE TABLE company (
    idCompany SERIAL PRIMARY KEY NOT NULL,
    nameCompany VARCHAR(255) NOT NULl,
    emailCompany VARCHAR(255) NOT NULL,
    cnpjCompany VARCHAR(14) NOT NULL
);

CREATE TABLE "user" (
    idUser SERIAL PRIMARY KEY NOT NULL,
    emailUser VARCHAR(255) NOT NULL,
    passwordUser VARCHAR(64) NOT NULL,
    pictureUser VARCHAR(255),
    fk_user_idCompany INT,

    CONSTRAINT fk_user_company FOREIGN KEY (fk_user_idCompany) REFERENCES company(idCompany) ON DELETE CASCADE
);

CREATE table category (
    idCategory SERIAL PRIMARY KEY NOT NULL,
    typeCategory VARCHAR(255) NOT NULL,
    colorCategory VARCHAR(255)
);

CREATE TABLE "status" (
    idStatus SERIAL PRIMARY KEY NOT NULL,
    typeStatus VARCHAR(255) NOT NULL,
    colorStatus VARCHAR(255)
);

CREATE TABLE feedback (
    idFeedback SERIAL PRIMARY KEY NOT NULL,
    titleFeedback VARCHAR(255) NOT NULL,
    reviewFeedback TEXT NOT NULL,
    fk_feedback_idUser INT NOT NULL,
    fk_feedback_idCompany INT NOT NULL,
    fk_feedback_idCategory INT NOT NULL,
    fk_feedback_idStatus INT NOT NULL,

    CONSTRAINT fk_feedback_user FOREIGN KEY (fk_feedback_idUser) REFERENCES "user"(idUser) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_company FOREIGN KEY (fk_feedback_idCompany) REFERENCES company(idCompany) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_category FOREIGN KEY (fk_feedback_idCategory) REFERENCES category(idCategory),
    CONSTRAINT fk_feedback_status FOREIGN KEY (fk_feedback_idStatus) REFERENCES status(idStatus)
);

CREATE TABLE reply (
    idReply SERIAL PRIMARY KEY NOT NULL,
    titleReply VARCHAR(255) NOT NULL,
    reviewReply TEXT NOT NULL,
    fk_reply_idFeedback INT NOT NULL,
    fk_reply_idUser INT NOT NULL,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reply_feedback FOREIGN KEY (fk_reply_idFeedback) REFERENCES feedback (idFeedback) ON DELETE CASCADE,
    CONSTRAINT fk_reply_user FOREIGN KEY (fk_reply_idUser) REFERENCES "user" (idUser) ON DELETE CASCADE
);