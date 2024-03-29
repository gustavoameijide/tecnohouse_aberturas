CREATE TABLE entradas(
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(255) UNIQUE NOT NULL,
    detalle VARCHAR(255),
    ancho VARCHAR(255),
    alto VARCHAR(255),
    ingreso NUMBER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email   VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)



ALTER TABLE users ADD COLUMN gravatar VARCHAR(255);

ALTER TABLE perfiles ADD COLUMN user_id INTEGER REFERENCES users(id);
