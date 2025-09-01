import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Printer, Archive } from 'lucide-react';

const SchoolsResultsPage = () => {
  const [results, setResults] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Google Sheet configuration
  const SPREADSHEET_ID = '14wa4PYN_Isd1zJumxa0kW7Fykg1MK65N'; // Spreadsheet ID
  const SHEET_NAME = 'Sheet1'; // Sheet tab name (e.g., 'Results')
  const API_KEY = ''; // Add API key if sheet is not public; leave empty if public

  // Fetch data from Google Sheet
  useEffect(() => {
    const fetchSheetData = async () => {
      setLoading(true);
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?majorDimension=ROWS${API_KEY ? `&key=${API_KEY}` : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch sheet data. Check sharing settings or API key.');
        }

        const data = await response.json();

        if (!data.values || data.values.length === 0) {
          setError('Sheet is empty or inaccessible');
          return;
        }

        // Extract headers (first row)
        const headers = data.values[0].map(header => header.trim());
        if (headers.length === 0) {
          setError('Sheet has no headers');
          return;
        }

        // Parse rows into objects
        const dataRows = data.values.slice(1).map(row => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index] || '-';
          });
          return rowData;
        });

        setHeaders(headers);
        setResults(dataRows);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error fetching or parsing sheet data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  // Trigger browser print dialog for PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start">
      <h1 className="text-3xl font-bold mb-6 text-foreground">TASSA Results System</h1>

      {/* Loading State */}
      {loading && (
        <Card className="w-full max-w-4xl mb-8">
          <CardContent className="text-center py-6">
            <p className="text-muted-foreground">Loading results...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="w-full max-w-4xl mb-8">
          <CardContent className="text-center py-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* General Results Template */}
      {!loading && !error && (
        <Card className="w-full max-w-4xl">
          <CardContent className="py-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">All Schools Results</h3>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 print:hidden"
                aria-label="Download as PDF"
              >
                <Printer className="h-5 w-5" />
                <span>Download PDF</span>
              </button>
            </div>
            {results.length === 0 ? (
              <div className="text-center">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No results have been released yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {headers.map((header, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {row[header] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SchoolsResultsPage;
