import { Request } from "express";
import path from "path";
import fileUpload from "express-fileupload";
import fsp from 'fs/promises';
import fs from 'fs';

type statusMessage = {
  recievedFiles: number;
  storedFiles: number;
};

export async function handleImageFiles(req: Request): Promise<statusMessage> {
  if (!req.files) {
    return { recievedFiles: 0, storedFiles: 0 };
  }

  let totalFilesRecieved = 0;
  let totalFilesStored = 0;

  for (let [_name, file] of Object.entries(req.files)) {
    //i can have a single file or multiple files
    if (Array.isArray(file)) {
      totalFilesRecieved += file.length;
      for (let f of file) {
        if (f.mimetype.includes("image")) {
          const stored = await handleFile(f);
          if (stored) {
            totalFilesStored += 1;
          }
        }
      }
    } else {
      if (file.mimetype.includes("image")) {
        totalFilesRecieved += 1;
        const stored = await handleFile(file);
        if (stored) {
          totalFilesStored += 1;
        }
      }
    }
  }

  return {
    recievedFiles: totalFilesRecieved,
    storedFiles: totalFilesStored,
  };
}

async function handleFile(file: fileUpload.UploadedFile): Promise<boolean> {
  const name = file.name;

  const dest = path.join(__dirname, "../public/uploads", name);
  const exists = await fileExists(dest);

  if (!exists) {
    try {
      await file.mv(dest);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  } else {
    return false;
  }
}

async function fileExists(file: string) {
  let exists = true;
  try {
    await fsp.access(file,  fs.constants.R_OK | fs.constants.W_OK);
  } catch(error) {
    console.log(error)
    exists = false;
  }
  return exists;
}
