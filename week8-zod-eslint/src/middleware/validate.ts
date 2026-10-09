import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

type ValidationSource = "body" | "params" | "query";

export function validate<S extends z.ZodType>(
  schema: S,
  source: ValidationSource,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const input: unknown =
      source === "body"
        ? req.body
        : source === "params"
          ? req.params
          : req.query;

    const result = schema.safeParse(input);

    if (!result.success) {
      res.status(400).json({
        errors: z.flattenError(result.error),
      });
      return;
    }

    const validated = (res.locals.validated ?? {}) as Record<string, unknown>;

    validated[source] = result.data;
    res.locals.validated = validated;

    next();
  };
}

export function getValidated<S extends z.ZodType>(
  res: Response,
  schema: S,
  source: ValidationSource,
): z.output<S> {
  const validated = res.locals.validated as Record<string, unknown> | undefined;

  return validated?.[source] as z.output<S>;
}
