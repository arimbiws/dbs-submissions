/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.horthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("companies", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    name: { type: "VARCHAR(100)", notNull: true },
    location: { type: "VARCHAR(100)", notNull: true }, 
    description: { type: "TEXT" },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("companies");
};
