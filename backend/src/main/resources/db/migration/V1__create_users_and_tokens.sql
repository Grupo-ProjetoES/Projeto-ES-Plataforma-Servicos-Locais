CREATE SEQUENCE user_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE users (
    id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE SEQUENCE invalidated_token_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE invalidated_tokens (
    id BIGINT NOT NULL,
    token VARCHAR(512) NOT NULL,
    invalidated_at TIMESTAMP NOT NULL,
    CONSTRAINT invalidated_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT invalidated_tokens_token_key UNIQUE (token)
);
