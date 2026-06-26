import { useSelector } from "react-redux"

export default function DashboardHeader() {
  const { user } = useSelector((state) => state.auth)
  
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Safe fallback if user name is not populated
  const doctorName = user?.name ? `Dr. ${user.name}` : "Doctor"

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back, {doctorName}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Here is a quick overview of your schedule and medical workflows today.
        </p>
      </div>
      <div className="bg-card px-4 py-2 rounded-lg border shadow-xs text-sm font-medium text-muted-foreground w-fit">
        {currentDate}
      </div>
    </div>
  )
}
