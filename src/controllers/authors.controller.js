//CAPA QUE SE CONECTA CON EL SERVICIO, NO HAY QUERY SQL ACA!!!!
import {
    getAllAuthors,
    getAuthorById,
    findAuthorByEmail,
    createAuthor,
    updateAuthor,
    deleteAuthor,
} from '../services/authors.service.js';

export async function listAuthors(req, res) {
    const authors = await getAllAuthors();
    res.status(200).json(authors);
}

export async function getAuthor(req, res) {
    const author = await getAuthorById(req.params.id);
    if (!author) {
        return res.status(404).json({ error: 'Author no encontrado' });
    }
    res.status(200).json(author);
}

export async function postAuthor(req, res) {
    const { name, email, bio } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'name es requerido' });
    }
    if (!email || !email.trim()) {
        return res.status(400).json({ error: 'email es requerido' });
    }

    const existing = await findAuthorByEmail(email)
    if (existing) {
        return res.status(400).json({ error: 'email ya está en uso' });

    }

    try {
        const author = await createAuthor({ name, email, bio });
        res.status(201).json(author);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'email ya está en uso' });
        }
        throw error;
    }
}

export async function putAuthor(req, res) {
    const { name, email, bio } = req.body;
    const { id } = req.params;
    const author = await getAuthorById(req.params.id);

    if (!author) {
        return res.status(404).json({ error: 'Author no encontrado' });
    }    

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'name es requerido' });
    }

    if (!email || !email.trim()) {
        return res.status(400).json({ error: 'email es requerido' });
    }

    const existing = await findAuthorByEmail(email);
    if (existing && String(existing.id) !== String(id)) {
        return res.status(400).json({ error: 'email ya está en uso por otro author' });
    }

    try {
        const updated = await updateAuthor(id, { name, email, bio });
        if (!updated) {
            return res.status(404).json({ error: 'Author no encontrado' });

        }
        res.status(200).json(updated);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'email ya está en uso' });
        }
        throw error;
    }
}

export async function removeAuthor(req, res) {
    const deleted = await deleteAuthor(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: 'Author no encontrado' });
    }
    res.status(204).send();
}