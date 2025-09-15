CREATE DATABASE sistema_inventario;
USE sistema_inventario;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'prestamista') NOT NULL
);

-- Tabla de materiales
CREATE TABLE materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('herramienta manual', 'herramienta eléctrica', 'insumo') NOT NULL,
    cantidad_disponible INT NOT NULL,
    descripcion TEXT
);

-- Tabla de solicitantes (estudiante o trabajador)
CREATE TABLE solicitantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('estudiante', 'trabajador') NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    matricula VARCHAR(20),
    carrera VARCHAR(100),
    lugar_trabajo VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100)
);

-- Tabla de préstamos
CREATE TABLE prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_material INT NOT NULL,
    cantidad INT NOT NULL,
    fecha_prestamo DATETIME NOT NULL,
    fecha_devolucion DATETIME,
    estado ENUM('prestado', 'finalizado') DEFAULT 'prestado',
    id_usuario INT NOT NULL,
    id_finalizado_por INT,
    id_solicitante INT NOT NULL,

    FOREIGN KEY (id_material) REFERENCES materiales(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_finalizado_por) REFERENCES usuarios(id),
    FOREIGN KEY (id_solicitante) REFERENCES solicitantes(id)
);

ALTER TABLE solicitantes
ADD COLUMN numero_empleado VARCHAR(20) UNIQUE;

ALTER TABLE prestamos
ADD COLUMN insumo_terminado BOOLEAN DEFAULT FALSE;

ALTER TABLE solicitantes
ADD CONSTRAINT unique_matricula UNIQUE (matricula);
ALTER TABLE solicitantes
ADD CONSTRAINT unique_numero_empleado UNIQUE (numero_empleado);

ALTER TABLE solicitantes 
MODIFY COLUMN nombre_completo VARCHAR(100) 
COLLATE utf8_unicode_ci NOT NULL;

select * from materiales;
select * from usuarios;
select * from prestamos;

ALTER TABLE materiales
ADD COLUMN ubicacion VARCHAR(100) AFTER descripcion;

drop database sistema_inventario;