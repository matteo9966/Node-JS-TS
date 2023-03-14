declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'testing';
        PORT?: string;
        DB_PATH:string;
        DB_PATH_TEST:string;
        JOBS_PORT:number;
      }
    }
  }
  export {}