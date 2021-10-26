"use strict";
const Books = use("App/Models/Book");

class BookController {
  async show({ request, response, params }) {
    try {
      let book = await Books.findOrFail(params.id);

      if (book) return response.status(200).send(book);
    } catch (error) {
      return response
        .status(404)
        .send({ error: "There is no book with the entered id" });
    }
  }

  async index({ request, response }) {
    let books = await Books.all();

    return books;
  }
  async store({ request, response }) {
    const data = request.body;

    //normalizar dados necessários

    data.author_name = data.author_name.toUpperCase();
    data.author_lastName = data.author_lastName.toUpperCase();

    try {
      let book = await Books.create(data);

      //object response

      if (book) {
        let book_response = {
          Id: book.id,
          Author: `${book.author_name}, ${book.author_lastName}`,
          Title: book.title,
          Gender: book.gender,
          Synopsys: book.sinopsys,
          Pages: book.pages,
        };

        return response.status(200).send(book_response);
      }
    } catch (error) {
      return response.status(400).send({
        error:
          "Error when registering book, check if the book is already registered and the values ​​informed",
      });
    }
  }

  async update({ request, response, params }) {
    try {
      let data = request.body;

      const book = await Books.findOrFail(params.id);

      book.merge(data);
      await book.save();

      let book_response = {
        Id: book.id,
        Author: `${book.author_name}, ${book.author_lastName}`,
        Title: book.title,
        Gender: book.gender,
        Synopsys: book.sinopsys,
        Pages: book.pages,
      };

      return response.status(205).send(book_response);
    } catch (error) {
      console.log(error);
      return response.status(404).send({ error: "Book not found" });
    }
  }

  async delete({ request, response, params }) {
    try {
      const book = await Books.findOrFail(params.id);

      await book.delete();

      return response.status(200).send({ livro_removido: book });
    } catch (error) {
      console.log(error);
      return response.status(404).send({ error: "Book not found" });
    }
  }
}

module.exports = BookController;
