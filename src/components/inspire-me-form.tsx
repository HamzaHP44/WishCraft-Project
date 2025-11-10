'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { generateInspirationalQuote } from '@/ai/flows/generate-inspirational-quote';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  theme: z.string({
    required_error: 'Please select a theme to generate a quote.',
  }).min(1, 'Please select a theme.'),
  personalDetail: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const themes = ['success', 'motivation', 'perseverance', 'happiness', 'love', 'life'];

export function InspireMeForm() {
  const [isPending, startTransition] = useTransition();
  const [generatedQuote, setGeneratedQuote] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: '',
      personalDetail: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setGeneratedQuote(null);
    startTransition(async () => {
      const result = await generateInspirationalQuote({
        theme: data.theme,
        personalDetail: data.personalDetail,
      });
      setGeneratedQuote(result.quote);
    });
  };

  return (
    <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-4xl md:text-5xl">InspireMe</CardTitle>
        <CardDescription className="text-base">
          Your daily dose of inspiration, tailored just for you.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose a Theme</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme} value={theme} className="capitalize">
                          {theme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personalize Your Quote (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'I'm starting a new gym routine' or 'facing a tough exam'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add a detail for a more personal touch.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Generating...' : 'Generate Quote'}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {(isPending || generatedQuote) && (
        <div className="p-6 pt-0 text-center">
          <div className="mt-6 border-t border-border pt-6 min-h-[10rem] flex items-center justify-center">
            {isPending && !generatedQuote && (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            )}
            {generatedQuote && (
              <div key={generatedQuote} className="fade-in">
                <blockquote className="font-headline text-xl md:text-2xl lg:text-3xl">
                  “{generatedQuote}”
                </blockquote>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
