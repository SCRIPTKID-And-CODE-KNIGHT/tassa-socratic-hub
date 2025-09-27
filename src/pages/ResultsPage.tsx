import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  School,
  Archive,
  ExternalLink,
  Trophy,
} from 'lucide-react';

const SchoolsResultsPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');

  const schools = [
    'OLD SHINYANGA SS',
    'DR OLSEN',
    'BEROYA SS',
    'TUKUYU SS',
    'RUBYA SEMINARY',
    'ARUSHA SCIENCE SS',
    'CHATO SS',
    'MWATULOLE SS',
    'MASWA GIRLS SS',
    'JIKOMBOE GIRLS HIGH SCHOOL',
    'NYABUSOZI SS',
    'MULBADAW SS',
    'KAGANGO SS',
    'NYANKUMBU GIRLS SS',
    'MPEMBA HIGH SCHOOL',
    'NATA HIGH SCHOOL',
    'CARMEL MOUNT GIRLS SS',
  ];

  const schoolDriveLinks: Record<string, string> = {
    'OLD SHINYANGA SS': 'https://drive.google.com/file/d/FILE_ID_1/view?usp=drivesdk',
    'DR OLSEN': 'https://docs.google.com/spreadsheets/d/1MAY5pAPJq5tPOHBjvtMPoRytpa0kzDCo/edit?usp=drive_link&ouid=102623279819468923794&rtpof=true&sd=true',
    'BEROYA SS': 'https://drive.google.com/file/d/FILE_ID_3/view?usp=drivesdk',
    'TUKUYU SS': 'https://drive.google.com/file/d/FILE_ID_4/view?usp=drivesdk',
    'RUBYA SEMINARY': 'https://docs.google.com/spreadsheets/d/1OHzgo4UYA-dkmgrLsvemUoEIopDzVnDT/edit?usp=drive_link&ouid=102623279819468923794&rtpof=true&sd=true',
    'ARUSHA SCIENCE SS': 'https://docs.google.com/spreadsheets/d/1cnRkh2aEvvsarDIfPvScEBLlmpNJbwGU/edit?usp=drive_link&ouid=102623279819468923794&rtpof=true&sd=true',
    'CHATO SS': 'https://drive.google.com/file/d/FILE_ID_7/view?usp=drivesdk',
    'MWATULOLE SS': 'https://drive.google.com/file/d/FILE_ID_8/view?usp=drivesdk',
    'MASWA GIRLS SS': 'https://drive.google.com/file/d/FILE_ID_9/view?usp=drivesdk',
    'JIKOMBOE GIRLS HIGH SCHOOL': 'https://drive.google.com/file/d/FILE_ID_10/view?usp=drivesdk',
    'NYABUSOZI SS': 'https://drive.google.com/file/d/FILE_ID_11/view?usp=drivesdk',
    'MULBADAW SS': 'https://drive.google.com/file/d/FILE_ID_12/view?usp=drivesdk',
    'KAGANGO SS': 'https://drive.google.com/file/d/FILE_ID_13/view?usp=drivesdk',
    'NYANKUMBU GIRLS SS': 'https://drive.google.com/file/d/FILE_ID_14/view?usp=drivesdk',
    'MPEMBA HIGH SCHOOL': 'https://drive.google.com/file/d/FILE_ID_15/view?usp=drivesdk',
    'NATA HIGH SCHOOL': 'https://drive.google.com/file/d/FILE_ID_16/view?usp=drivesdk',
    'CARMEL MOUNT GIRLS SS': 'https://drive.google.com/file/d/FILE_ID_17/view?usp=drivesdk',
  };

  const generalResultsUrl =
    'https://docs.google.com/spreadsheets/d/1_CC87mgmgdDjmtB0lxsxbnXCIImnBZ_71HQsbV2cKm4/edit?usp=drivesdk';

  const topTenResultsUrl =
    'https://docs.google.com/spreadsheets/d/1guVsB1ZKRLKRZlhKDfTXGlDx78XXF1VQdijfhp0NC9w/edit?usp=drivesdk';

  const topTenSchoolsUrl =
    'https://docs.google.com/spreadsheets/d/YOUR_TOP_TEN_SCHOOLS_FILE_ID/view?usp=drivesdk'; // Replace with your link

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 flex flex-col items-center">
      <h1 className="text-2xl sm:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm px-4">
        TASSA Results System
      </h1>

      {/* School Selector */}
      <div className="w-full max-w-md px-4 sm:px-0 animate-fade-in">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg font-semibold">
              <School className="h-5 w-5 text-blue-600" />
              <span>Select School</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="w-full h-12 rounded-xl shadow-md border border-gray-200 focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder="Choose school..." />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school} value={school} className="py-3">
                    {school}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Announcement */}
      {!selectedSchool && (
        <div className="w-full max-w-2xl mt-8 px-4 sm:px-0 animate-fade-in">
          <Card className="text-center py-10 px-6 rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent>
              <School className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-4 text-gray-800">Results Announcement</h3>
              <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
                The results have been released and currently we have:
                <br />
                <span className="font-semibold">• General Results</span>
                <br />
                <span className="font-semibold">• Top Ten Students</span>
                <br />
                <span className="font-semibold">• Top Ten Schools</span>
                <br />
                <br />
                Individual school results will be uploaded shortly.
              </p>
              <p className="text-gray-500 font-medium">— TASSA IT Department</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Cards */}
      {selectedSchool && (
        <div className="w-full max-w-md mt-8 px-4 sm:px-0 space-y-6 animate-fade-in">
          {/* General Results */}
          <Card className="text-center py-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent>
              <Archive className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-6">{selectedSchool}</h3>
              <a
                href={generalResultsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition"
              >
                View General Results
                <ExternalLink className="h-5 w-5 ml-2" />
              </a>
            </CardContent>
          </Card>

          {/* Top Ten Students */}
          <Card className="text-center py-8 rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent>
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-6">Top Ten Students</h3>
              <a
                href={topTenResultsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition"
              >
                View Top Ten
                <ExternalLink className="h-5 w-5 ml-2" />
              </a>
            </CardContent>
          </Card>

          {/* Top Ten Schools */}
          <Card className="text-center py-8 rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent>
              <Trophy className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-6">Top Ten Schools</h3>
              <a
                href={topTenSchoolsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition"
              >
                View Top Schools
                <ExternalLink className="h-5 w-5 ml-2" />
              </a>
            </CardContent>
          </Card>

          {/* Individual Results */}
          {schoolDriveLinks[selectedSchool] ? (
            <Card className="text-center py-8 rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent>
                <h3 className="text-lg sm:text-xl font-bold mb-6">
                  {selectedSchool} – Individual Results
                </h3>
                <a
                  href={schoolDriveLinks[selectedSchool]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition"
                >
                  Open School Results
                  <ExternalLink className="h-5 w-5 ml-2" />
                </a>
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-gray-500 mt-6">
              Individual results for <strong>{selectedSchool}</strong> will be uploaded soon.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolsResultsPage;
