import "./WeekSchedule.css";

interface ScheduleDay {
  date: string;
  status: "active" | "upcoming" | "idle" | "locked";
}

interface WeekScheduleProps {
  label: string;
  icon: string;
  color: "blue" | "yellow" | "orange";
  days: ScheduleDay[];
  onMarkDone?: () => void;   // valfri klick-callback för aktiv prick
  upgradeMessage?: string;   // valfritt: visas när spåret är locked
}

function WeekSchedule({
  label,
  icon,
  color,
  days,
  onMarkDone,
  upgradeMessage,
}: WeekScheduleProps) {
  const isLocked = days.every((day) => day.status === "locked");

  return (
    <div className={`week-schedule week-schedule-${color} ${isLocked ? "is-locked" : ""}`}>
      <div className="week-schedule-label">
        <span className="week-schedule-icon">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="week-schedule-dots">
        {days.map((day) => (
          <button
            key={day.date}
            type="button"
            className={`schedule-dot schedule-dot-${day.status}`}
            title={day.date}
            disabled={day.status !== "active"}
            onClick={day.status === "active" ? onMarkDone : undefined}
          />
        ))}
      </div>
      {isLocked && upgradeMessage && (
        <div className="week-schedule-upgrade">🔒 {upgradeMessage}</div>
      )}
    </div>
  );
}

export default WeekSchedule;