import { RequestHandler } from "express";

export const notfoundMiddleware: RequestHandler = (req, res, next) => {
  res.status(404);
  res.set('Content-Type', 'text/html');
  res.send(`
    <div style="display:flex;justify-content:center;align-items:center;flex-direction:column">
        <h1 style="">Page not found</h1>
        <h2>404</h2>
    </div>
    `);
    res.end();
};
