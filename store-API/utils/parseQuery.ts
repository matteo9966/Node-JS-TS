//TODO: approfondisci i generics di zod
// import { z } from "zod";
// export const customParseSafe = <T extends z.ZodRawShape>(obj: z.ZodObject<T>) => {
//   return (record: Record<string, string | number>) => {
//     const parsed = obj.safeParse(record);
//     if (parsed.success) {
//       return parsed.data;
//     } else {
//       return {};
//     }
//   };
// };
