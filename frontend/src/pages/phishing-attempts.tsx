import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Clock, Search, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { phishingApi } from "@/services/phishing.api";

interface PhishingAttempt {
  _id: string;
  recipientEmail: string;
  emailContent: string;
  status: string;
  createdAt: string;
}

type StatusFilter = "all" | "clicked" | "sent";

export default function PhishingAttemptsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState<PhishingAttempt[]>([]);

  useEffect(() => {
    fetchPhishingAttempts();
  }, []);

  const fetchPhishingAttempts = async () => {
    setIsLoading(true);
    try {
      const data = await phishingApi.getAllAttempts();
      setAttempts(data);
    } catch (error) {
      console.error("Failed to fetch phishing attempts:", error);
      toast({
        variant: "destructive",
        title: "Failed to load data",
        description:
          "There was an error loading phishing attempts. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPhishingAttempts();
  };

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch =
      attempt.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.emailContent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || attempt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "clicked":
        return (
          <Badge
            variant="success"
            className="flex items-center gap-1 bg-green-500"
          >
            <CheckCircle className="h-3 w-3" />
            Clicked
          </Badge>
        );
      case "sent":
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Sent
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Phishing Attempts</h1>
        <p className="text-muted-foreground">
          View and manage all phishing simulation attempts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phishing Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or content..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="clicked">Clicked</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Recipient</TableHead>
                  <TableHead className="min-w-[250px]">Email Content</TableHead>
                  <TableHead className="min-w-[150px]">Sent At</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Loading phishing attempts...
                    </TableCell>
                  </TableRow>
                ) : filteredAttempts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No phishing attempts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttempts.map((attempt) => (
                    <TableRow key={attempt._id}>
                      <TableCell className="font-medium min-w-[200px]">
                        {attempt.recipientEmail}
                      </TableCell>
                      <TableCell className="min-w-[250px]">
                        {attempt.emailContent || "-"}
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        {format(
                          new Date(attempt.createdAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        {getStatusBadge(attempt.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
