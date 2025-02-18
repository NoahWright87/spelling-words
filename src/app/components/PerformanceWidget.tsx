import { useEffect, useState } from 'react';
import { SpellingWordListPerformance } from '@/data/SpellingWordListPerformance';
import '../../app/globals.css';

interface PerformanceWidgetProps {
  performanceList: SpellingWordListPerformance;
}

const PerformanceWidget: React.FC<PerformanceWidgetProps> = ({ performanceList }) => {
  const totalAttempts = performanceList.getTotalAttempts();
  const totalCorrect = performanceList.getTotalCorrect();
  const highestStreak = performanceList.getMaxStreak();
  const averageCurrentCorrectPercentage = performanceList.getAverageCurrentCorrectPercentage();
  const averageTotalCorrectPercentage = performanceList.getAverageTotalCorrectPercentage();

  return (
    <div className="performance-widget">
      <div className="column">
        <h3>Last Attempt</h3>
        {totalAttempts > 0 ? (
          <>
            <p>Average Current Correct Percentage: {averageCurrentCorrectPercentage.toFixed(2)}%</p>
          </>
        ) : (
          <p>N/A</p>
        )}
      </div>
      <div className="column">
        <h3>Totals</h3>
        {totalAttempts > 0 ? (
          <>
            <p>{totalCorrect} / {totalAttempts} ({averageTotalCorrectPercentage.toFixed(2)}%)</p>
            <p>Highest Streak: {highestStreak}</p>
          </>
        ) : (
          <p>N/A</p>
        )}
      </div>
    </div>
  );
};

export default PerformanceWidget;
