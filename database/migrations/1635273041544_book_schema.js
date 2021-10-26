"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BookSchema extends Schema {
  up() {
    this.table("books", (table) => {
      table.boolean("book_status").default("true");
    });
  }

  down() {
    this.table("books", (table) => {});
  }
}

module.exports = BookSchema;
