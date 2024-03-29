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
        AUTHENTICATION_APP_PORT:string;
        FILE_UPLOAD_PORT:number;
        CLOUDINARY_CLOUD_NAME:string;
        CLOUDINARY_API_KEY:string;
        CLOUDINARY_API_SECRET:string;
      }
    }
  }
  export {}