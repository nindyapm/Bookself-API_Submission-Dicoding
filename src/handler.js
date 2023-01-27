const { nanoid } = require('nanoid');
const Books = require('./books');

const saveBooksHandler = (request, h) => {
  const {
    name, year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(15);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const book = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  Books.push(book);
  // eslint-disable-next-line no-shadow
  const isSuccess = Books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const objectModel = (obj) => obj.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const setResponse = (book) => {
    const response = h.response({
      status: 'success',
      data: {
        books: book,
      },
    });
    response.code(200);
    return response;
  };

  const { reading, finished, name } = request.query;

  if (reading === '1') {
    // eslint-disable-next-line no-shadow
    const book = objectModel(Books.filter((book) => book.reading === true));
    return setResponse(book);
  }

  if (reading === '0') {
    // eslint-disable-next-line no-shadow
    const book = objectModel(Books.filter((book) => book.reading === false));
    return setResponse(book);
  }

  if (finished === '1') {
    // eslint-disable-next-line no-shadow
    const book = objectModel(Books.filter((book) => book.finished === true));
    return setResponse(book);
  }

  if (finished === '0') {
    // eslint-disable-next-line no-shadow
    const book = objectModel(Books.filter((book) => book.finished === false));
    return setResponse(book);
  }

  if (name) {
    const book = objectModel(
      // eslint-disable-next-line no-shadow
      Books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())),
    );
    return setResponse(book);
  }

  return setResponse(objectModel(Books));
};

const getBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;
  // eslint-disable-next-line no-shadow
  const book = Books.filter((book) => book.id === bookId);

  if (book < 1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: book[0],
    },
  });
  response.code(200);
  return response;
};

const editBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // eslint-disable-next-line no-shadow
  const book = Books.filter((book) => book.id === bookId);

  if (book !== -1) {
    Books[book] = {
      ...Books[book],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      updatedAt,
      reading,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;
  // eslint-disable-next-line no-shadow
  const book = Books.filter((book) => book.id === bookId);

  if (book < 1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  saveBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
