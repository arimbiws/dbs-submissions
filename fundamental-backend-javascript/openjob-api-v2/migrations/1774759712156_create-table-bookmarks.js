/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("bookmarks", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    user_id: { type: "VARCHAR(50)", notNull: true },
    job_id: { type: "VARCHAR(50)", notNull: true },
    created_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });

  pgm.addConstraint("bookmarks", "fk_books.user_id_users.id", "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE");
  pgm.addConstraint("bookmarks", "fk_books.job_id_jobs.id", "FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("bookmarks");
};
