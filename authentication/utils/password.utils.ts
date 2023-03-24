import { hash, verify } from "argon2";

export const passwordUtils = {
  async hashPassword(password: string) {
    try {
      const hashedPW = await hash(password);
      return hashedPW;
    } catch (error) {
      console.dir(error);
      return null;
    }
  },

  async verifyPassord(passHash: string, passord: string) {
    try {
      if (await verify(passHash, passord)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.dir(error);
      return false;
    }
  },
};
