import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { userType } from "../models/user.model";
const isTestEnvironment = process.env.NODE_ENV === 'testing';
const testingExt = isTestEnvironment?"-test":"";
const private_key_path = path.join(__dirname, `../keys/private${testingExt}.pem`);
const public_key_path = path.join(__dirname, `../keys/public${testingExt}.pem`);

const private_key = fs.readFileSync(private_key_path);
const public_key = fs.readFileSync(public_key_path);

function createJWT(user: userType): Promise<string> {
  const payload:Omit<userType,'password'> = {
    email: user.email, id: user.id, roles: user.roles,
    name: user.name
  };
  return new Promise((res, rej) => {
    jwt.sign(
      payload,
      private_key,
      { expiresIn: '1000d', algorithm: "RS256" },
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

export const jwtFns =  { createJWT, verifyJWT };
