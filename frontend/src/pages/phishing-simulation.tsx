import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import { phishingApi } from "@/services/phishing.api";

const simulationSchema = z.object({
  recipientEmail: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  emailTemplate: z
    .string()
    .min(1, { message: "Please select an email template" }),
  customSubject: z.string().optional(),
  customContent: z.string().optional(),
});

type SimulationFormValues = z.infer<typeof simulationSchema>;

const emailTemplates = [
  { id: "password-reset", name: "Password Reset Request" },
  { id: "account-verification", name: "Account Verification" },
  { id: "invoice-payment", name: "Invoice Payment Due" },
  { id: "document-share", name: "Document Sharing Request" },
  { id: "it-update", name: "IT System Update Required" },
];

export default function PhishingSimulationPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      recipientEmail: "",
      emailTemplate: "",
      customSubject: "",
      customContent: "",
    },
  });

  const watchEmailTemplate = watch("emailTemplate");

  const handleTemplateChange = (templateId: string) => {
    setValue("emailTemplate", templateId);
    setSelectedTemplate(templateId);

    switch (templateId) {
      case "password-reset":
        setValue("customSubject", "URGENT: Your Password Reset Request");
        setValue(
          "customContent",
          "Your account password needs to be reset. Please click the link below to reset your password immediately.\n\n[RESET PASSWORD]"
        );
        break;
      case "account-verification":
        setValue("customSubject", "Account Verification Required");
        setValue(
          "customContent",
          "Your account needs to be verified. Please click the link below to verify your account.\n\n[VERIFY ACCOUNT]"
        );
        break;
      case "invoice-payment":
        setValue("customSubject", "Invoice #INV-2023-001 Payment Due");
        setValue(
          "customContent",
          "Your invoice payment is due. Please click the link below to view and pay your invoice.\n\n[VIEW INVOICE]"
        );
        break;
      case "document-share":
        setValue("customSubject", "Important Document Shared With You");
        setValue(
          "customContent",
          "An important document has been shared with you. Please click the link below to view and download the document.\n\n[VIEW DOCUMENT]"
        );
        break;
      case "it-update":
        setValue("customSubject", "URGENT: IT System Update Required");
        setValue(
          "customContent",
          "Your system requires an urgent security update. Please click the link below to install the update.\n\n[INSTALL UPDATE]"
        );
        break;
      default:
        setValue("customSubject", "");
        setValue("customContent", "");
    }
  };

  const onSubmit = async (data: SimulationFormValues) => {
    setIsSubmitting(true);

    try {
      await phishingApi.sendSimulation({
        recipientEmail: data.recipientEmail,
        emailTemplate: data.emailTemplate,
        customSubject: data.customSubject,
        customContent: data.customContent,
      });

      setIsSuccess(true);
      toast({
        title: "Phishing simulation sent",
        description: `Email sent to ${data.recipientEmail}`,
      });

      setTimeout(() => {
        reset();
        setIsSuccess(false);
        setSelectedTemplate(null);
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send simulation",
        description:
          "There was an error sending the phishing simulation. Please try again.",
      });
      console.error("Error sending phishing simulation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Phishing Simulation
        </h1>
        <p className="text-muted-foreground">
          Create and send phishing simulation emails to test user awareness
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Phishing Simulation</CardTitle>
          <CardDescription>
            Configure and send a phishing simulation email to a recipient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="simulation-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="recipient@example.com"
                {...register("recipientEmail")}
              />
              {errors.recipientEmail && (
                <p className="text-sm text-destructive">
                  {errors.recipientEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailTemplate">Email Template</Label>
              <Select
                onValueChange={handleTemplateChange}
                value={watchEmailTemplate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("emailTemplate")} />
              {errors.emailTemplate && (
                <p className="text-sm text-destructive">
                  {errors.emailTemplate.message}
                </p>
              )}
            </div>

            {selectedTemplate && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="customSubject">Email Subject</Label>
                  <Input
                    id="customSubject"
                    placeholder="Enter email subject"
                    {...register("customSubject")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customContent">Email Content</Label>
                  <Textarea
                    id="customContent"
                    placeholder="Enter email content"
                    rows={6}
                    {...register("customContent")}
                  />
                </div>
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              setSelectedTemplate(null);
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="simulation-form"
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              "Sending..."
            ) : isSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Sent Successfully
              </>
            ) : (
              "Send Phishing Simulation"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
