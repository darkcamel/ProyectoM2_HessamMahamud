//centralizar errores
export function errorHandler(err, req, res, next) {
    console.log(err);

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON inválido en el body' });
    }
    
    if (err.code === '23505') {
        return res.status(400).json({ error: 'El valor ya existe (violación de unicidad)' });
    }

    if (err.code === '23503') {
        return res.status(400).json({ error: 'Referencia inválida (foreign key' });
    }

    res.status(500).json({ error: 'Error interno el servidor' });
}