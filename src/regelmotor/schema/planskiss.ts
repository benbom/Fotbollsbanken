import { z } from 'zod';

/**
 * Kopplingspunkt för planskissens schema (ADR 0012).
 *
 * ADR 0010 avsnitt 1 säger att `planskiss` ska prövas mot planskissutvecklarens Zod-schema,
 * som src/regelmotor/schema/ovning.ts importerar. Modulen src/planskiss/ ägs av
 * planskissutvecklaren och finns inte än, så den importen kan inte skrivas här.
 *
 * Tills schemat finns underkänns varje övning som *har* fältet. Det är avsiktligt och följer
 * S-07: skissdata får aldrig släppas igenom ovaliderad, vare sig från en repofil eller från
 * appen. En övning utan planskiss berörs inte, och sådana är tillåtna i banken
 * (berättelse 06, kriterium 2).
 *
 * När src/planskiss/ finns byts platshållaren mot det riktiga schemat på ett ställe:
 * `createExerciseSchemas({ planskiss: planskissSchema })` i ovning.ts.
 */
export const PLANSKISS_MISSING_MESSAGE =
  'planskiss kan inte valideras än: schemat i ADR 0012 (src/planskiss/) är inte byggt. ' +
  'Ta bort fältet tills ritmotorn finns, eller vänta på planskissutvecklaren (S-07).';

/** Platshållare som alltid underkänner ett ifyllt `planskiss`-fält. */
export const planskissPlaceholderSchema: z.ZodType<unknown> = z
  .unknown()
  .superRefine((_value, ctx) => {
    ctx.addIssue({ code: 'custom', message: PLANSKISS_MISSING_MESSAGE });
  });
