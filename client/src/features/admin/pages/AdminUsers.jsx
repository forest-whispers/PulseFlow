import { useSearchParams, useNavigate } from "react-router-dom"
import { Calendar, User, Stethoscope, RefreshCw, AlertCircle, Eye, Mail, Users, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUsers } from "../hooks/useUsers"
import AppointmentPagination from "../../patient/components/AppointmentPagination"

function formatDate(dateStr) {
  if (!dateStr) return "N/A"
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

export default function AdminUsers() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const page = parseInt(searchParams.get("page") || "1", 10)
  const role = searchParams.get("role") || "all"
  const limit = 10

  const {
    data: listData,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers(page, limit, role)

  const users = listData?.data?.users || []
  const pagination = listData?.data?.pagination || { page: 1, totalPages: 1, total: 0 }

  const handlePageChange = (newPage) => {
    setSearchParams({ role, page: String(newPage) })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleRoleChange = (newRole) => {
    setSearchParams({ role: newRole, page: "1" })
  }

  const handleViewDetails = (userId) => {
    navigate(`/admin/users/${userId}`, {
      state: { fromParams: searchParams.toString() }
    })
  }

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 animate-pulse">
        <div className="flex flex-col gap-1.5 pb-2">
          <div className="h-7 w-48 bg-muted/65 rounded-md" />
          <div className="h-4 w-72 bg-muted/50 rounded-md" />
        </div>

        <div className="flex gap-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-muted/40 rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="border rounded-2xl h-[200px] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Error retry state
  if (isError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto animate-fade-in">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Failed to Load Users</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {error?.response?.data?.message || error?.message || "We encountered an issue retrieving user accounts. Please try again."}
          </p>
        </div>
        <Button onClick={() => refetch()} className="w-full gap-2 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">User Management</h2>
        <p className="text-xs text-muted-foreground">
          Monitor and review hospital doctor profiles, patient accounts, and system registration indexes.
        </p>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex gap-2 sm:gap-2.5 flex-wrap bg-muted/20 p-1.5 rounded-xl border border-border/10 self-start inline-flex">
        {[
          { key: "all", label: "All Users" },
          { key: "doctor", label: "Doctors" },
          { key: "patient", label: "Patients" },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={role === tab.key ? "default" : "ghost"}
            onClick={() => handleRoleChange(tab.key)}
            className="rounded-lg font-bold text-xs h-8 px-4 cursor-pointer transition-all duration-300"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {users.length === 0 ? (
        // Empty State
        <Card className="border border-dashed border-border/40 shadow-2xs bg-card p-12 text-center rounded-2xl">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1.5">No Users Found</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            There are no registered user records matching the selected role criteria.
          </p>
        </Card>
      ) : (
        // Grid Listing
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((userItem) => {
              const isDoc = userItem.role === "doctor"
              const Icon = isDoc ? Stethoscope : User
              
              return (
                <Card 
                  key={userItem._id} 
                  onClick={() => handleViewDetails(userItem._id)}
                  className="border border-border/40 shadow-2xs bg-card hover:shadow-xs hover:border-primary/20 transition-all duration-300 flex flex-col justify-between overflow-hidden rounded-2xl cursor-pointer group"
                >
                  <CardHeader className="p-5 pb-3 border-b border-border/10 flex flex-row items-center justify-between gap-4 bg-muted/5">
                    <div className="flex gap-2.5 items-center min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-border/5">
                        <Icon className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-sm font-extrabold text-foreground truncate max-w-[180px] group-hover:text-primary transition-colors">
                        {userItem.name}
                      </CardTitle>
                    </div>
                    <Badge
                      className={
                        isDoc
                          ? "bg-blue-500/10 text-blue-600 border-blue-200/35 font-bold text-[10px] rounded-md shadow-2xs"
                          : "bg-indigo-500/10 text-indigo-600 border-indigo-200/35 font-bold text-[10px] rounded-md shadow-2xs"
                      }
                    >
                      {userItem.role.toUpperCase()}
                    </Badge>
                  </CardHeader>

                  <CardContent className="p-5 space-y-4 flex-1 text-xs">
                    {/* Email info */}
                    <div className="flex gap-2 items-center text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                      <span className="truncate select-all">{userItem.email}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-border/5 text-xs text-muted-foreground">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-wider block">Age</span>
                          <p className="font-semibold text-foreground mt-0.5">{userItem.age ?? "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-wider block">Gender</span>
                          <p className="font-semibold text-foreground mt-0.5 capitalize">{userItem.gender || "N/A"}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-wider block">Joined Date</span>
                        <p className="font-semibold text-foreground mt-0.5">
                          {formatDate(userItem.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-3 pb-4 border-t border-border/10 bg-muted/10 flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(userItem._id)
                      }}
                      className="gap-1.5 rounded-xl font-bold cursor-pointer text-xs group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                      variant="outline"
                    >
                      View Profile
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <AppointmentPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={limit}
            onPageChange={handlePageChange}
            label="users"
          />
        </div>
      )}
    </div>
  )
}
