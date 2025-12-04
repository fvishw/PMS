import { type Request, type Response, type NextFunction } from "express";
const asyncHandler = (requestHandler: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
export default asyncHandler;
