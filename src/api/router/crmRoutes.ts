import { Request, Response } from 'express';

export class Routes {
  public routes(app) {
    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'GET request',
      });
    });

    // user
    app
      .route('/user')
      // GET
      .get((req: Request, res: Response) => {
        // console.log('req', req.headers);
        res.status(200).send({
          name: 'test',
          mail: 'test@test.com',
        });
      })
      // POST
      .post((req: Request, res: Response) => {
        res.status(200).send({
          hello: 'hello world',
        });
      });
  }
}
