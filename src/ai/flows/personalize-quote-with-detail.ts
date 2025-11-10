'use server';

/**
 * @fileOverview A flow that personalizes a quote with a user-provided detail.
 *
 * - personalizeQuoteWithDetail - A function that personalizes a quote.
 * - PersonalizeQuoteWithDetailInput - The input type for the personalizeQuoteWithDetail function.
 * - PersonalizeQuoteWithDetailOutput - The return type for the personalizeQuoteWithDetail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeQuoteWithDetailInputSchema = z.object({
  theme: z
    .string()
    .describe("The theme of the quote, e.g., 'success', 'motivation', or 'perseverance'."),
  personalDetail: z
    .string()
    .describe('A personal detail or challenge the user is facing.'),
});
export type PersonalizeQuoteWithDetailInput = z.infer<typeof PersonalizeQuoteWithDetailInputSchema>;

const PersonalizeQuoteWithDetailOutputSchema = z.object({
  quote: z.string().describe('The personalized quote.'),
});
export type PersonalizeQuoteWithDetailOutput = z.infer<typeof PersonalizeQuoteWithDetailOutputSchema>;

export async function personalizeQuoteWithDetail(input: PersonalizeQuoteWithDetailInput): Promise<PersonalizeQuoteWithDetailOutput> {
  return personalizeQuoteWithDetailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeQuoteWithDetailPrompt',
  input: {schema: PersonalizeQuoteWithDetailInputSchema},
  output: {schema: PersonalizeQuoteWithDetailOutputSchema},
  prompt: `Generate an inspirational quote based on the theme '{{{theme}}}', tailored to the following personal detail: {{{personalDetail}}}.`,
});

const personalizeQuoteWithDetailFlow = ai.defineFlow(
  {
    name: 'personalizeQuoteWithDetailFlow',
    inputSchema: PersonalizeQuoteWithDetailInputSchema,
    outputSchema: PersonalizeQuoteWithDetailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
