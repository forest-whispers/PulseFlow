export default function PatientHeader({ patientName, formattedDate }) {
  const finalName = patientName || "Patient"
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back, {finalName}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Access your digital health records, consult doctors, and track your clinical schedule.
        </p>
      </div>
      {formattedDate && (
        <div className="bg-card px-4 py-2 rounded-lg border shadow-xs text-sm font-medium text-muted-foreground w-fit shrink-0 md:self-center">
          {formattedDate}
        </div>
      )}
    </div>
  )
}
