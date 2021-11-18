import express, { Response, Request } from "express";

class ArbitageController {
  static async getArbitages(req: Request, res: Response) {
      return res.status(200).send({
          arbitages: []
      })
  }
}

export default ArbitageController;
