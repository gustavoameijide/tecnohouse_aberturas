CREATE TABLE perfiles(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    color VARCHAR(255),
    descripcion TEXT,
    categoria text,
    peso_neto_barra_6mts NUMBER,
    stock NUMBER,
    disponible TYPE BOOLEAN
);


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email   VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE categoriasPerfiles(
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE coloresPerfiles(
    id SERIAL PRIMARY KEY,
    color VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

ALTER TABLE users ADD COLUMN gravatar VARCHAR(255);

ALTER TABLE perfiles ADD COLUMN user_id INTEGER REFERENCES users(id);

ALTER TABLE clientes ADD COLUMN user_id INTEGER REFERENCES users(id);

ALTER TABLE presupuesto ADD COLUMN user_id INTEGER REFERENCES users(id);

ALTER TABLE facturacion ADD COLUMN user_id INTEGER REFERENCES users(id);

ALTER TABLE datos_facturacion ADD COLUMN user_id INTEGER REFERENCES users(id);

ALTER TABLE categorias ADD COLUMN user_id INTEGER REFERENCES users(id);

ALTER TABLE colores ADD COLUMN user_id INTEGER REFERENCES users(id);