import { Request, Response } from 'express';

export abstract class TemplateController {
	abstract find(req: Request, res: Response);

	abstract create(req: Request, res: Response);

	abstract update(req: Request, res: Response);

	abstract delete(req: Request, res: Response);
}
