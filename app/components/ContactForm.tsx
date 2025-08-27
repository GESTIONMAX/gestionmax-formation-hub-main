import { useState } from "react";
import { useConfetti } from "../_lib/hooks/useConfetti";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  phone: z.string().optional(),
  trainingType: z.string({ required_error: "Veuillez sélectionner un type de formation" }),
  specificTraining: z.string().optional(),
  message: z.string().min(10, { message: "Votre message doit comporter au moins 10 caractères" }),
  rgpd: z.boolean()
    .refine((val) => val === true, {
      message: "Vous devez accepter la politique de confidentialité",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  trainingTitle?: string;
  isPartnerTraining?: boolean;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const ContactForm = ({ 
  trainingTitle = "",
  isPartnerTraining = false, 
  onSubmit, 
  onCancel 
}: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fireConfetti } = useConfetti();
  
  // Options pour le select de type de formation
  const trainingTypes = [
    { value: "wordpress-fr", label: "Formation WordPress (Français)" },
    { value: "wordpress-en", label: "Formation WordPress (Anglais - Partenaire)" },
    { value: "autre", label: "Autre demande" },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      trainingType: trainingTitle 
        ? (isPartnerTraining ? "wordpress-en" : "wordpress-fr") 
        : "",
      specificTraining: trainingTitle || "",
      message: trainingTitle 
        ? `Je souhaite obtenir des informations sur la formation "${trainingTitle}".` 
        : "",
      rgpd: false,
    },
  });

  const handleFormSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulation d'un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Traitement différencié en fonction du type de formation
      if (data.trainingType === "wordpress-en") {
        console.log("Traitement spécifique pour les formations partenaires en anglais", data);
        // Logique spécifique aux formations partenaires
        // Par exemple, envoi d'une copie au partenaire ou marquage dans le CRM
      }
      
      // Lancer l'effet de confetti
      fireConfetti();
      
      // Appeler la fonction de soumission fournie en props
      onSubmit(data);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Votre email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Votre téléphone (facultatif)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="trainingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de formation *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de formation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trainingTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          name="specificTraining"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formation spécifique</FormLabel>
              <FormControl>
                <Input placeholder="Précisez la formation si connue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Votre message, questions ou besoins spécifiques" 
                  className="min-h-32" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rgpd"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  J'accepte la politique de confidentialité et le traitement de mes données personnelles *
                </FormLabel>
                <p className="text-sm text-gray-500">
                  En soumettant ce formulaire, j'accepte que mes données personnelles soient utilisées pour me recontacter. 
                  Aucun autre traitement ne sera effectué avec mes informations. Voir notre {" "}
                  <a href="/politique-confidentialite" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                    politique de confidentialité
                  </a>.
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours
              </>
            ) : (
              "Envoyer ma demande"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
