import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Calendar, Trophy } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ExamCountdown = () => {
  // Next TASSA Series Exam Date - Update this as needed
  const examDate = new Date('2026-03-15T08:00:00');
  const seriesName = "Series 1 Exam 2026";
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = examDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-lg border-2 border-blue-400/30">
        <span className="text-2xl sm:text-3xl font-bold">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-xs sm:text-sm font-medium text-blue-700 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );

  if (isExpired) {
    return (
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8 animate-bounce" />
          <div className="text-center">
            <h3 className="text-xl font-bold">Exam Day is Here!</h3>
            <p className="text-emerald-100">Good luck to all TASSA students!</p>
          </div>
          <Trophy className="h-8 w-8 animate-bounce" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-blue-200/50 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"></div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Countdown to</span>
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold text-center text-blue-900 mb-6">
          {seriesName}
        </h3>

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <TimeBlock value={timeLeft.days} label="Days" />
          <span className="text-2xl font-bold text-blue-400 mt-[-20px]">:</span>
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <span className="text-2xl font-bold text-blue-400 mt-[-20px]">:</span>
          <TimeBlock value={timeLeft.minutes} label="Mins" />
          <span className="text-2xl font-bold text-blue-400 mt-[-20px]">:</span>
          <TimeBlock value={timeLeft.seconds} label="Secs" />
        </div>

        {/* Exam Date Display */}
        <div className="mt-6 flex items-center justify-center gap-2 text-blue-700">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">
            {examDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>

        {/* Motivational message */}
        <p className="text-center text-blue-600/80 text-sm mt-4 italic">
          &quot;Excellence is not a destination but a continuous journey&quot;
        </p>
      </div>
    </Card>
  );
};

export default ExamCountdown;
