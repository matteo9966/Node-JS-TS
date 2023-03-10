import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { UserSignupType, UserType } from "../models/user.model";

const private_key_path = path.join(__dirname, "../keys/private.pem");
const public_key_path = path.join(__dirname, "../keys/public.pem");
const private_key = fs.readFileSync(private_key_path);
const public_key = fs.readFileSync(public_key_path);

function createJWT(user: UserSignupType): Promise<string> {
  const payload = { username: user.username, email: user.email, id: user.id };
  return new Promise((res, rej) => {
    jwt.sign(
      payload,
      private_key,
      { expiresIn: 1000, algorithm: "RS256" },
      (err, token) => {
        if (err) {
          rej(err);
        } else {
          if (token) {
            res(token);
          } else {
            rej(null);
          }
        }
      }
    );
  });
}

function verifyJWT(token: string) {
  return new Promise((res, rej) => {
    jwt.verify(token, public_key, (err, payload) => {
      if (err) {
        rej(err);
      } else {
        res(payload);
      }
    });
  });
}

export { createJWT, verifyJWT };
