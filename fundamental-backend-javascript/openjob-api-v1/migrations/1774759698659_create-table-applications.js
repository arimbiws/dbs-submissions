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
  pgm.createTable("applications", {
    id: { type: "VARCHAR(50)", primaryKey: true },
    user_id: { type: "VARCHAR(50)", notNull: true },
    job_id: { type: "VARCHAR(50)", notNull: true },
    status: { type: "VARCHAR(20)", notNull: true, default: "pending" },
  });

  pgm.addConstraint("applications", "fk_apps.user_id_users.id", "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE");
  pgm.addConstraint("applications", "fk_apps.job_id_jobs.id", "FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("applications");
};
