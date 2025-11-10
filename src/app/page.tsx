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
import { Loader2, Cake, ArrowLeft } from 'lucide-react';

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

  const handleBack = () => {
    setGeneratedWish(null);
    setName('');
    form.reset();
  };

  return (
    <div className="relative min-h-screen w-full font-body text-foreground">
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 perspective">
        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Generating your special wish...</p>
          </div>
        ) : !generatedWish ? (
          <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl fade-in">
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
          </Card>
        ) : (
          <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-2xl animate-open-card" style={{ transformStyle: 'preserve-3d' }}>
             <div className="p-8 text-center">
              <h3 className="font-headline text-3xl md:text-4xl">Happy Birthday, {name}!</h3>
              <div className="mt-8 border-t border-border pt-8">
                  <p className="text-xl italic">
                    {generatedWish}
                  </p>
              </div>
              <CardFooter className="flex justify-center mt-8">
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="mr-2" /> Back
                </Button>
              </CardFooter>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
