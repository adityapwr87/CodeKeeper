import React, { useState, useEffect } from "react";
import "./Calendar.css";
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";

const Calendar = () => {
  const [contests, setContests] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contests from API
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://competeapi.vercel.app/contests/upcoming/"
        );
        const data = await response.json();
        setContests(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch contests:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // Group contests by date
  const getContestsByDate = (date) => {
    const dateStr = date.toDateString(); // use local date string to avoid UTC shift
    return contests.filter((contest) => {
      try {
        const contestDateObj = new Date(contest.startTime);
        // Validate that the date is valid
        if (isNaN(contestDateObj.getTime())) {
          return false; // Skip invalid dates
        }
        const contestDate = contestDateObj.toDateString();
        return contestDate === dateStr;
      } catch (e) {
        return false; // Skip on any error
      }
    });
  };

  // Get all days in current month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <div>
      <Navbar />
      <div className="calendar-container">
        {/* Header */}
        <div className="calendar-header">
          <h1>🗓️ Upcoming Contests Calendar</h1>
          <p>Track coding contests across all platforms</p>
        </div>

        {/* Calendar Controls */}
        <div className="calendar-controls">
          <button onClick={goToPreviousMonth} className="nav-btn">
            ← Previous
          </button>
          <h2>
            {monthName} {year}
          </h2>
          <button onClick={goToNextMonth} className="nav-btn">
            Next →
          </button>
        </div>

        {/* Loading / Error States */}
        {loading && <p className="loading-text">Loading contests...</p>}
        {error && <p className="error-text">Error: {error}</p>}

        {/* Calendar Grid */}
        {!loading && !error && (
          <div className="calendar-wrapper">
            <div className="calendar-grid">
              <div className="day-header">Sun</div>
              <div className="day-header">Mon</div>
              <div className="day-header">Tue</div>
              <div className="day-header">Wed</div>
              <div className="day-header">Thu</div>
              <div className="day-header">Fri</div>
              <div className="day-header">Sat</div>

              {calendarDays.map((day, idx) => {
                const dayContests = day
                  ? getContestsByDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )
                    )
                  : [];

                return (
                  <div
                    key={idx}
                    className={`calendar-day ${day ? "active" : "empty"}`}
                  >
                    {day && (
                      <>
                        <div className="day-number">{day}</div>
                        <div className="contests-list">
                          {dayContests.length > 0 ? (
                            dayContests.map((contest, i) => (
                              <a
                                key={i}
                                href={contest.url}
                                target="_blank"
                                rel="noreferrer"
                                className="contest-link"
                                title={contest.title}
                              >
                                <span className="contest-name">
                                  {contest.title.substring(0, 20)}
                                </span>
                                <span className="contest-platform">
                                  {contest.site}
                                </span>
                              </a>
                            ))
                          ) : (
                            <span className="no-contest">-</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Contests List */}
      </div>
      <Footer />
    </div>
  );
};

export default Calendar;
