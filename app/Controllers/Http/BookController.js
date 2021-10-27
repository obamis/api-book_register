"use strict";
const Books = use("App/Models/Book");

class BookController {
  async show({ request, response, params }) {
    try {
      let book = await Books.findOrFail(params.id);

      if (book.book_status !== 0) {
        book.book_status = "Available";
        return response.status(200).send(book);
      } else {
        return response.status(200).send({
          Unavaiable_book: "This book is not available for consultation.",
        });
      }
    } catch (error) {
      return response
        .status(404)
        .send({ error: "There is no book with the entered id" });
    }
  }

  async index({ request, response }) {
    // let books = await Books.all();

    try {
      let books = await Books.query()
        .select(
          "id",
          "author_name",
          "author_lastName",
          "title",
          "gender",
          "sinopsys",
          "pages"
        )
        .where("book_status", "=", 1)
        .fetch();

      return books;
    } catch (error) {
      console.log(error);
      return response.status(400).send("Erro while listing books");
    }
  }

  async returnByGender({ request, response, params }) {
    try {
      let gender = params.gender.toUpperCase();

      let books = await Books.query()
        .select(
          "id",
          "author_name",
          "author_lastName",
          "title",
          "gender",
          "sinopsys",
          "pages"
        )
        .where("gender", "=", gender)
        .andWhere("book_status", "=", 1)
        .fetch();

      return books;
    } catch (error) {
      console.log(error);
    }
  }

  async store({ request, response }) {
    const data = request.body;

    //normalizar dados necessários

    data.author_name = data.author_name.toUpperCase();
    data.author_lastName = data.author_lastName.toUpperCase();
    data.gender = data.gender.toUpperCase();

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
      let data = request.only([
        "author_name",
        "author_lastName",
        "title",
        "gender",
        "sinopsys",
        "pages",
      ]);

      data.author_name = data.author_name.toUpperCase();
      data.author_lastName = data.author_lastName.toUpperCase();
      data.gender = data.gender.toUpperCase();

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

      if (book.book_status === 0) {
        return response
          .status(200)
          .send({ book_status: "Book already deleted" });
      } else {
        //soft-delete
        book.book_status = false;
        await book.save();
        // await book.delete();

        let removed_book = {
          id: book.id,
          author: `${book.author_lastName},${book.author_name}`,
          title: book.title,
          gender: book.gender,
          sinopsys: book.sinopsys,
          pages: book.pages,
        };

        return response.status(200).send({ removed_book: removed_book });
      }
    } catch (error) {
      console.log(error);
      return response.status(404).send({ error: "Book not found" });
    }
  }
}

module.exports = BookController;
