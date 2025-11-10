'use server';

/**
 * @fileOverview Generates a personalized birthday wish.
 *
 * - generateBirthdayWish - A function that generates a personalized birthday wish.
 * - GenerateBirthdayWishInput - The input type for the generateBirthdayWish function.
 * - GenerateBirthdayWishOutput - The return type for the generateBirthdayWish function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBirthdayWishInputSchema = z.object({
  name: z.string().describe("The name of the person whose birthday it is."),
});
export type GenerateBirthdayWishInput = z.infer<typeof GenerateBirthdayWishInputSchema>;

const GenerateBirthdayWishOutputSchema = z.object({
  wish: z.string().describe('The generated birthday wish.'),
});
export type GenerateBirthdayWishOutput = z.infer<typeof GenerateBirthdayWishOutputSchema>;

export async function generateBirthdayWish(
  input: GenerateBirthdayWishInput
): Promise<GenerateBirthdayWishOutput> {
  return generateBirthdayWishFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBirthdayWishPrompt',
  input: {schema: GenerateBirthdayWishInputSchema},
  output: {schema: GenerateBirthdayWishOutputSchema},
  prompt: `You are an AI that writes heartfelt and creative birthday messages.

  Name: {{{name}}}

  Generate a warm and personal birthday wish for {{{name}}}. The wish should be 2-3 sentences long, celebrating them and wishing them a fantastic year ahead. Avoid clichés.
  `,
});

const generateBirthdayWishFlow = ai.defineFlow(
  {
    name: 'generateBirthdayWishFlow',
    inputSchema: GenerateBirthdayWishInputSchema,
    outputSchema: GenerateBirthdayWishOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
