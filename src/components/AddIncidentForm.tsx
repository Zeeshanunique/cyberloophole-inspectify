import React, { useState } from 'react';
import { app } from '../integrations/firebase/config';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

// Initialize Firestore with the app instance
const db = getFirestore(app);

// Form schema validation
const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters long' }),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  sector: z.string().min(1, { message: 'Please select a sector' }),
  source: z.string().min(1, { message: 'Source is required' }),
  sourceUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  attackVector: z.string().optional(),
  status: z.enum(['new', 'investigating', 'resolved', 'false_positive']),
  indicators: z.string().optional(),
  affectedSystems: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const sectorOptions = [
  'Banking & Finance',
  'Healthcare',
  'Government',
  'Education',
  'Retail',
  'Power & Energy',
  'Telecommunications',
  'Technology',
  'Transportation',
  'Manufacturing',
  'Other',
];

export function AddIncidentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      severity: 'medium',
      sector: '',
      source: '',
      sourceUrl: '',
      attackVector: '',
      status: 'new',
      indicators: '',
      affectedSystems: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Process indicators and affected systems as arrays if provided
      const indicators = data.indicators ? data.indicators.split(',').map(item => item.trim()) : [];
      const affectedSystems = data.affectedSystems ? data.affectedSystems.split(',').map(item => item.trim()) : [];

      // Create incident object
      const incident = {
        title: data.title,
        description: data.description,
        severity: data.severity,
        sector: data.sector,
        source: data.source,
        sourceUrl: data.sourceUrl || null,
        attackVector: data.attackVector || null,
        status: data.status,
        indicators: indicators.length > 0 ? indicators : [],
        affectedSystems: affectedSystems.length > 0 ? affectedSystems : [],
        date: Timestamp.now(),
        collectedAt: Timestamp.now(),
        processed: true,
      };

      // Add to Firestore
      const incidentsRef = collection(db, 'incidents');
      const docRef = await addDoc(incidentsRef, incident);

      toast({
        title: "Incident added successfully",
        description: `Incident "${data.title}" has been added to the database.`,
        variant: "default",
      });

      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error adding incident:', error);
      toast({
        title: "Error adding incident",
        description: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New Cyber Incident</CardTitle>
        <CardDescription>Enter the details of a new cyber incident to add to the database.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter incident title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a detailed description of the incident" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectorOptions.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="false_positive">False Positive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter source name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sourceUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/source" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="attackVector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attack Vector (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Phishing, Ransomware, DDoS" {...field} />
                  </FormControl>
                  <FormDescription>
                    Specify the technique or method used in the attack
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="indicators"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indicators of Compromise (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., IP addresses, domains, file hashes (comma-separated)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter any IoCs separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affectedSystems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affected Systems (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Web Server, Database, Email System (comma-separated)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter affected systems separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Adding..." : "Add Incident"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AddIncidentForm; 