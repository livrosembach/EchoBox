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

CREATE TABLE "user" (
    idUser SERIAL PRIMARY KEY NOT NULL,
    emailUser VARCHAR(255) NOT NULL,
    passwordUser VARCHAR(32) NOT NULL
);

CREATE TABLE company (
    idCompany SERIAL PRIMARY KEY NOT NULL,
    emailCompany VARCHAR(255) NOT NULL,
    CNPJCompany VARCHAR(14) NOT NULL
);

CREATE table category (
    idCategory SERIAL PRIMARY KEY NOT NULL,
    typeCategory VARCHAR(255) NOT NULL
);

CREATE TABLE feedback (
    idFeedback SERIAL PRIMARY KEY NOT NULL,
    titleFeedback VARCHAR(255) NOT NULL,
    reviewFeedback TEXT,
    ratingFeedback INTEGER NOT NULL CONSTRAINT rating1to5 CHECK (ratingFeedback BETWEEN 1 AND 5),
    fk_feedback_idUser INT NOT NULL,
    fk_feedback_idCompany INT NOT NULL,
    fk_feedback_idCategory INT NOT NULL,

    CONSTRAINT fk_feedback_user FOREIGN KEY (fk_feedback_idUser) REFERENCES "user"(idUser),
    CONSTRAINT fk_feedback_company FOREIGN KEY (fk_feedback_idCompany) REFERENCES company(idCompany),
    CONSTRAINT fk_feedback_category FOREIGN KEY (fk_feedback_idCategory) REFERENCES category(idCategory)
);