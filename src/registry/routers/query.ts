import { z } from 'zod';

import { protectedProcedure, router } from '@/lib/trpc/server';

export const queryRouter = router({
  run: protectedProcedure
    .input(
      z.object({
        prompt: z.string().trim(),
      }),
    )
    .mutation(async ({ input }) => {}),
});
