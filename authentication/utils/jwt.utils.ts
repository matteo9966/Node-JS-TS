import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import path from "path";
const public_key_path = path.join(__dirname, "../public.pem");
const private_key_path = path.join(__dirname, "../private.pem");

const privateKey = fs.readFileSync(private_key_path);
const publicKey = fs.readFileSync(public_key_path);

export const jwtUtils = {
  //this version alwais resolves with a  token
  async createJWT(
    payload: Record<string, any>,
    signOptions?: jsonwebtoken.SignOptions
  ):Promise<string|null> {
    return new Promise((resolve, _reject) => {
      jsonwebtoken.sign(
        payload,
        privateKey,
        { algorithm: "RS256", expiresIn: "1d", ...signOptions },
        (error, token) => {
          if (error) {
            console.dir(error);
            resolve(null);
          } else {
            resolve(token as string);
          }
        }
      );
    });
  },
  async verifyJWT(token: string) {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, publicKey, (err, payload) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload);
        }
      });
    });
  },
};
