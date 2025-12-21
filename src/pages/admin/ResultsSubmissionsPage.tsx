import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { FileSpreadsheet, Download, Loader2, Check, X, Clock } from "lucide-react";
import { format } from "date-fns";

interface Submission {
  id: string;
  school_name: string;
  teacher_name: string;
  teacher_email: string | null;
  teacher_phone: string;
  series_number: number;
  file_url: string;
  file_name: string;
  notes: string | null;
  status: string;
  created_at: string;
}

export default function ResultsSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('result_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('result_submissions')
        .update({ 
          status, 
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(submissions.map(s => 
        s.id === id ? { ...s, status } : s
      ));

      toast({
        title: "Status updated",
        description: `Submission marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      // Extract the file path from the URL
      const urlParts = fileUrl.split('/result-submissions/');
      if (urlParts.length < 2) {
        throw new Error('Invalid file URL');
      }
      const filePath = urlParts[1];

      // Create a signed URL for download (valid for 60 seconds)
      const { data, error } = await supabase.storage
        .from('result-submissions')
        .createSignedUrl(filePath, 60);

      if (error) throw error;

      // Open the signed URL in a new tab to trigger download
      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message || "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin')}
          className="mb-6"
        >
          ← Back to Admin Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FileSpreadsheet className="h-8 w-8" />
            Results Submissions
          </h1>
          <p className="text-muted-foreground">
            Review and manage results submitted by teachers
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Submissions ({submissions.length})</CardTitle>
            <CardDescription>
              Click on a file to download and review
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No submissions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Series</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.school_name}</TableCell>
                        <TableCell>
                          <div>
                            <p>{submission.teacher_name}</p>
                            <p className="text-xs text-muted-foreground">{submission.teacher_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>Series {submission.series_number}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => downloadFile(submission.file_url, submission.file_name)}
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            {submission.file_name.length > 20 
                              ? submission.file_name.substring(0, 20) + '...'
                              : submission.file_name
                            }
                          </button>
                        </TableCell>
                        <TableCell>
                          {format(new Date(submission.created_at), 'MMM d, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>
                          <Select
                            value={submission.status}
                            onValueChange={(value) => updateStatus(submission.id, value)}
                            disabled={updatingId === submission.id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}