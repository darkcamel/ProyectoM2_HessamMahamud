//CAPA QUE SE CONECTA CON EL SERVICIO, NO HAY QUERY SQL ACA!!!!
import {
    getAllAuthors,
    getAuthorById,
    findAuthorByEmail,
    createAuthor,
    updateAuthor,
    deleteAuthor
} from '../services/authors.service.js';
import { AppError } from '../utils/AppError.js';


export async function listAuthors(req, res, next) {
    try {
        const authors = await getAllAuthors();
        res.status(200).json(authors);

    } catch (error) {
        next(error);
    }
}

export async function getAuthor(req, res, next) {
    try {
        const author = await getAuthorById(req.params.id);
        if (!author) {
            return next(new AppError('Author no encontrado', 404));
        }
        res.status(200).json(author);

    } catch (error) {
        next(error);
    }
}

export async function postAuthor(req, res, next) {
    const { name, email, bio } = req.body;

    if (!name || !name.trim()) {
        return next(new AppError('Name es requerido', 400));
    }

    if (!email || !email.trim()) {
        return next(new AppError('Email es requerido', 400));
    }

    try {
        const existing = await findAuthorByEmail(email);
        if (existing) {
            return next(new AppError('Email ya está en uso', 400));
        }

        const author = await createAuthor({ name, email, bio });
        res.status(201).json(author);

    } catch (error) {
        if (error.code === '23505') {
            return next(new AppError('Email ya está en uso', 400));
        }
        next(error);
    }
}

export async function putAuthor(req, res, next) {
    const { name, email, bio } = req.body;
    const { id } = req.params;

    if (!name || !name.trim()) {
        return next(new AppError('Name es requerido', 400));
    }

    if (!email || !email.trim()) {
        return next(new AppError('Email es requerido', 400));
    }

    try {
        const author = await getAuthorById(id);
        if (!author) {
            return next(new AppError('Author no encontrado', 404));
        }

        const existing = await findAuthorByEmail(email);
        if (existing && String(existing.id) !== String(id)) {
            return next(new AppError('Email ya está en uso por otro author', 400));
        }


        const updated = await updateAuthor(id, { name, email, bio });
        if (!updated) {
            return next(new AppError('Author no encontrado', 404));
        }
        res.status(200).json(updated);

    } catch (error) {
        if (error.code === '23505') {
            return next(new AppError('Email ya está en uso', 400));
        }
        next(error);
    }
}

export async function removeAuthor(req, res, next) {
    try {
        const deleted = await deleteAuthor(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Author no encontrado' });
        }
        res.status(204).send();

    } catch (error) {
        next(error);
    }
}