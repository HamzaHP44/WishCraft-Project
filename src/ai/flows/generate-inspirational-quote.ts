'use server';

/**
 * @fileOverview Generates inspirational quotes based on user-selected themes and personal details.
 *
 * - generateInspirationalQuote - A function that generates a personalized inspirational quote.
 * - GenerateInspirationalQuoteInput - The input type for the generateInspirationalQuote function.
 * - GenerateInspirationalQuoteOutput - The return type for the generateInspirationalQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInspirationalQuoteInputSchema = z.object({
  theme: z
    .string()
    .describe("The theme for the inspirational quote (e.g., 'success', 'motivation', 'perseverance')."),
  personalDetail: z
    .string()
    .describe('A personal detail to incorporate into the quote (e.g., a challenge the user is facing).')
    .optional(),
});
export type GenerateInspirationalQuoteInput = z.infer<typeof GenerateInspirationalQuoteInputSchema>;

const GenerateInspirationalQuoteOutputSchema = z.object({
  quote: z.string().describe('The generated inspirational quote.'),
});
export type GenerateInspirationalQuoteOutput = z.infer<typeof GenerateInspirationalQuoteOutputSchema>;

export async function generateInspirationalQuote(
  input: GenerateInspirationalQuoteInput
): Promise<GenerateInspirationalQuoteOutput> {
  return generateInspirationalQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInspirationalQuotePrompt',
  input: {schema: GenerateInspirationalQuoteInputSchema},
  output: {schema: GenerateInspirationalQuoteOutputSchema},
  prompt: `You are an AI that generates inspirational quotes based on a given theme and, if provided, a personal detail.

  Theme: {{{theme}}}
  {{#if personalDetail}}
  Personal Detail: {{{personalDetail}}}
  {{/if}}

  Generate an inspirational quote that is relevant to the theme and incorporates the personal detail if available.  The quote should sound wise and have a hopeful tone.  Do not mention that you are an AI.
  `,
});

const generateInspirationalQuoteFlow = ai.defineFlow(
  {
    name: 'generateInspirationalQuoteFlow',
    inputSchema: GenerateInspirationalQuoteInputSchema,
    outputSchema: GenerateInspirationalQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
