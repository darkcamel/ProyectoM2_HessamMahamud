import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('../services/authors.service.js');
vi.mock('../services/posts.service.js');
vi.mock('../services/comments.service.js');

const authorsService = await import('../services/authors.service.js');
const postsService = await import('../services/posts.service.js');
const commentsService = await import('../services/comments.service.js');
const { app } = await import('../server.js');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Authors', () => {
  it('GET /authors -> 200 con lista', async () => {
    authorsService.getAllAuthors.mockResolvedValue([{ id: 1, name: 'A' }]);
    const res = await request(app).get('/authors');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'A' }]);
  });

  it('GET /authors/:id inexistente -> 404', async () => {
    authorsService.getAuthorById.mockResolvedValue(null);
    const res = await request(app).get('/authors/999');
    expect(res.status).toBe(404);
  });

  it('POST /authors sin name -> 400', async () => {
    const res = await request(app).post('/authors').send({ email: 'a@a.com' });
    expect(res.status).toBe(400);
    expect(authorsService.createAuthor).not.toHaveBeenCalled();
  });

  it('POST /authors válido -> 201', async () => {
    authorsService.findAuthorByEmail.mockResolvedValue(null);
    authorsService.createAuthor.mockResolvedValue({ id: 1, name: 'A', email: 'a@a.com' });
    const res = await request(app).post('/authors').send({ name: 'A', email: 'a@a.com' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(1);
  });

  it('POST /authors con email duplicado -> 400', async () => {
    authorsService.findAuthorByEmail.mockResolvedValue({ id: 5 });
    const res = await request(app).post('/authors').send({ name: 'A', email: 'a@a.com' });
    expect(res.status).toBe(400);
  });

  it('DELETE /authors/:id inexistente -> 404', async () => {
    authorsService.deleteAuthor.mockResolvedValue(false);
    const res = await request(app).delete('/authors/999');
    expect(res.status).toBe(404);
  });

  it('DELETE /authors/:id existente -> 204', async () => {
    authorsService.deleteAuthor.mockResolvedValue(true);
    const res = await request(app).delete('/authors/1');
    expect(res.status).toBe(204);
  });
});

describe('Posts', () => {
  it('POST /posts con author_id inexistente -> 400', async () => {
    authorsService.getAuthorById.mockResolvedValue(null);
    const res = await request(app)
      .post('/posts')
      .send({ title: 'T', content: 'C', author_id: 999 });
    expect(res.status).toBe(400);
    expect(postsService.createPost).not.toHaveBeenCalled();
  });

  it('POST /posts válido -> 201', async () => {
    authorsService.getAuthorById.mockResolvedValue({ id: 1 });
    postsService.createPost.mockResolvedValue({ id: 1, title: 'T' });
    const res = await request(app)
      .post('/posts')
      .send({ title: 'T', content: 'C', author_id: 1 });
    expect(res.status).toBe(201);
  });

  it('GET /posts/author/:authorId con author inexistente -> 404', async () => {
    authorsService.getAuthorById.mockResolvedValue(null);
    const res = await request(app).get('/posts/author/999');
    expect(res.status).toBe(404);
  });
});

describe('Comments', () => {
  it('GET /posts/:postId/comments con post inexistente -> 404', async () => {
    postsService.getPostById.mockResolvedValue(null);
    const res = await request(app).get('/posts/999/comments');
    expect(res.status).toBe(404);
  });

  it('POST /comments válido -> 201', async () => {
    authorsService.getAuthorById.mockResolvedValue({ id: 1 });
    postsService.getPostById.mockResolvedValue({ id: 1 });
    commentsService.createComment.mockResolvedValue({ id: 1, content: 'hola' });
    const res = await request(app)
      .post('/comments')
      .send({ post_id: 1, author_id: 1, content: 'hola' });
    expect(res.status).toBe(201);
  });
});