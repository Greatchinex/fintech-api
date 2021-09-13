module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: false,
  synchronize: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  },
  entities: ["build/entity/**/*.js"],
  migrations: ["build/migration/**/*.js"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
};
