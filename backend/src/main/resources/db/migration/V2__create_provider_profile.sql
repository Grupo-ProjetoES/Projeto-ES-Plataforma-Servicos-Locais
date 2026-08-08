CREATE SEQUENCE provider_profile_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE provider_profiles (
    id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    document VARCHAR(20) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    CONSTRAINT provider_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT provider_profiles_user_id_key UNIQUE (user_id),
    CONSTRAINT provider_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE provider_profile_phones (
    provider_profile_id BIGINT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    CONSTRAINT provider_profile_phones_fkey FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles (id)
);

CREATE TABLE provider_profile_service_areas (
    provider_profile_id BIGINT NOT NULL,
    service_area VARCHAR(255) NOT NULL,
    CONSTRAINT provider_profile_service_areas_fkey FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles (id)
);

CREATE SEQUENCE service_category_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE service_categories (
    id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT service_categories_pkey PRIMARY KEY (id),
    CONSTRAINT service_categories_name_key UNIQUE (name)
);

CREATE TABLE provider_profile_categories (
    provider_profile_id BIGINT NOT NULL,
    service_category_id BIGINT NOT NULL,
    CONSTRAINT provider_profile_categories_pkey PRIMARY KEY (provider_profile_id, service_category_id),
    CONSTRAINT provider_profile_categories_provider_fkey FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles (id),
    CONSTRAINT provider_profile_categories_category_fkey FOREIGN KEY (service_category_id) REFERENCES service_categories (id)
);
