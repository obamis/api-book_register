"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BookSchema extends Schema {
  up() {
    this.create("books", (table) => {
      table.increments();
      table.string("author_name").notNullable();
      table.string("author_lastName");
      table.string("title").unique();
      table.string("gender");
      table.string("sinopsys");
      table.integer("pages");

      table.timestamps();
    });
  }

  down() {
    this.drop("books");
  }
}

module.exports = BookSchema;
