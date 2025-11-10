'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { generateBirthdayWish } from '@/ai/flows/generate-birthday-wish';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Cake } from 'lucide-react';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter a name.')
    .regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces are allowed.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function BirthdayPage() {
  const [isPending, startTransition] = useTransition();
  const [generatedWish, setGeneratedWish] = useState<string | null>(null);
  const [name, setName] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setGeneratedWish(null);
    setName(data.name);
    startTransition(async () => {
      const result = await generateBirthdayWish({
        name: data.name,
      });
      setGeneratedWish(result.wish);
    });
  };

  return (
    <div className="relative min-h-screen w-full font-body text-foreground">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
      >
        <source src="/videos/ink.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-4">
              <Cake className="h-12 w-12 text-primary" />
              <CardTitle className="font-headline text-4xl md:text-5xl">Birthday Wishes</CardTitle>
            </div>
            <CardDescription className="text-base pt-2">
              Create a special birthday message for someone you love.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
                <Button type="submit" size="lg" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? 'Generating...' : 'Generate Wish'}
                </Button>
              </CardFooter>
            </form>
          </Form>

          {(isPending || generatedWish) && (
            <div className="p-6 pt-0 text-center">
              <div className="mt-6 border-t border-border pt-6 min-h-[10rem] flex items-center justify-center">
                {isPending && !generatedWish && (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                )}
                {generatedWish && (
                  <div key={generatedWish} className="fade-in text-left space-y-4">
                     <h3 className="font-headline text-2xl text-center">Happy Birthday, {name}!</h3>
                    <p className="text-lg">
                      {generatedWish}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
