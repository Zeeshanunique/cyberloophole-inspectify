import React, { useState } from 'react';
import { app } from '../integrations/firebase/config';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

// Initialize Firestore with the app instance
const db = getFirestore(app);

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  url: z.string().url({ message: 'Please enter a valid URL' }),
  type: z.enum(['rss', 'api', 'website']),
  selector: z.string().optional(),
  keywords: z.string().optional(),
  enabled: z.boolean().default(true),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddSourceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
      type: 'website',
      selector: '',
      keywords: '',
      enabled: true,
      description: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Process keywords as array if provided
      const keywords = data.keywords ? data.keywords.split(',').map(item => item.trim()) : [];

      // Create source object
      const source = {
        name: data.name,
        url: data.url,
        type: data.type,
        selector: data.selector || null,
        keywords: keywords.length > 0 ? keywords : [],
        enabled: data.enabled,
        description: data.description || null,
        lastScraped: null,
      };

      // Add to Firestore
      const sourcesRef = collection(db, 'dataSources');
      const docRef = await addDoc(sourcesRef, source);

      toast({
        title: "Data Source added successfully",
        description: `"${data.name}" has been added to the database.`,
        variant: "default",
      });

      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error adding data source:', error);
      toast({
        title: "Error adding data source",
        description: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch form values to show/hide conditional fields
  const sourceType = form.watch('type');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Data Source</CardTitle>
        <CardDescription>Add a new source for collecting cyber incident data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter source name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/feed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="rss">RSS Feed</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Specify what type of source this is
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Enabled</FormLabel>
                      <FormDescription>
                        Enable or disable this data source
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {sourceType === 'website' && (
              <FormField
                control={form.control}
                name="selector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CSS Selector (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., .article-content, #main-content" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      CSS selector to target the content on the webpage
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., breach, attack, vulnerability (comma-separated)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Keywords to look for in the content (comma-separated)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a description of this data source" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Adding..." : "Add Data Source"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AddSourceForm; 