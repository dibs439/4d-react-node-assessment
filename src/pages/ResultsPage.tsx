import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { api } from '../api/api';
import { FormData } from '../types';

const parseSearchQuery = (query: any) => {
  const filters: Record<string, string> = {};

  const regex = /([^:\s]+):([^\s"]+|"[^"]+")/g;
  let match;

  while ((match = regex.exec(query)) !== null) {
    const key = match[1];
    let value = match[2];
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    filters[key] = value;
  }
  return filters;
};

const parseFullNameSearchQuery = (query: string) => {
  let filters: Record<string, string> = {};

  const words = query.trim().split(/\s+/);

  if (words.length >= 1) {
    let fullName = query.trim();

    if (fullName.startsWith('"') && fullName.endsWith('"')) {
      fullName = fullName.slice(1, -1);
    }

    filters = {
      fullName: fullName.toLowerCase(),
    };
  }

  return filters;
};

const filterSubmissions = (submissions: any, searchTerm: any) => {
  if (!searchTerm) return submissions;

  let filters = parseSearchQuery(searchTerm);

  if (Object.keys(filters).length == 0) {
    filters = parseFullNameSearchQuery(searchTerm);
  }

  return submissions.filter((item: any) => {
    return Object.keys(filters).every((key) => {
      if (key === 'fullName') {
        const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
        if (filters.fullName) {
          return fullName.includes(filters.fullName);
        }
      } else if (key === 'startDate') {
        const [start, end] = filters[key].split('..');
        const itemDate = new Date(item.startDate);
        return (
          (!start || new Date(start) <= itemDate) &&
          (!end || itemDate <= new Date(end))
        );
      }

      const value = item[key]?.toString().toLowerCase();

      return value && value.includes(filters[key].toLowerCase());
    });
  });
};

const ResultsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const data = await api.getSubmissions();
        setSubmissions(data);
        setError(null);
      } catch (err) {
        console.error('ResultsPage: Error fetching documents', err);
        setError('Failed to retrieve documents. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const filteredData = filterSubmissions(submissions, searchTerm);

  return (
    <main role="main" className="p-4">
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle>Document Management System</CardTitle>
          <CardDescription>
            Advanced Search for Employee Documents
          </CardDescription>
          <Input
            placeholder="Search (e.g. 'costCenter:IT', 'startDate:2024-01-01..2024-02-01')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm mt-4"
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Cost Center</TableHead>
                    <TableHead>Project Code</TableHead>
                    <TableHead>Supervisor Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No matching records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((submission: any) => (
                      <TableRow key={submission.employeeId}>
                        <TableCell>
                          {submission.firstName} {submission.lastName}
                        </TableCell>
                        <TableCell>{submission.employeeId}</TableCell>
                        <TableCell>
                          {new Date(submission.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{submission.costCenter}</TableCell>
                        <TableCell>{submission.projectCode}</TableCell>
                        <TableCell>{submission.supervisorEmail}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ResultsPage;
