-- Datos de ejemplo para authors
INSERT INTO authors (name, email, bio) VALUES
    ('Ana García', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'),
    ('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos'),
    ('María López', 'maria@example.com', 'Ingeniera de software con foco en APIs REST');

-- Datos de ejemplo para posts
INSERT INTO posts (title, content, author_id, published) VALUES
    ('Introducción a Node.js', 'Node.js es un runtime de JavaScript...', 1, true),
    ('PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', 2, true),
    ('APIs RESTful', 'REST es un estilo arquitectónico...', 1, true),
    ('Manejo de errores en Express', 'El manejo apropiado de errores...', 3, false),
    ('Async/Await explicado', 'Las promesas simplifican el código asíncrono...', 1, false);

-- Datos de ejemplo para comments
INSERT INTO comments (post_id, author_id, content) VALUES
    (1, 2, 'Excelente introducción, muy clara.'),
    (1, 3, 'Me ayudó mucho a entender los fundamentos.'),
    (2, 1, 'Buena comparativa, pero faltó mencionar MongoDB.'),
    (3, 2, 'Totalmente de acuerdo con los principios REST.'),
    (4, 1, 'Justo lo que necesitaba para mi proyecto.'),
    (5, 3, 'El async/await cambió mi vida como desarrollador.'),
    (5, 2, 'Muy útil el ejemplo práctico.');