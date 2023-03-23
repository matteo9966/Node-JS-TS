declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'testing';
        PORT?: string;
        DB_PATH:string;
        DB_PATH_TEST:string;
        JOBS_PORT:number;
        SENDGRID_API_KEY:string;
        VERIFIED_SENDER:string;
        SECRET_EMAIL_PASSWROD:string;
        MONGODB_CONNECTION_STRING:string;
      }
    }
  }
  export {}