import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Monitor,
  Bell,
  Eye,
  Shield,
  Info,
  Sliders,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Settings() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const role = user?.role || "patient"

  // 1. Appearance States
  const [themePref, setThemePref] = useState("system")
  const [compactNav, setCompactNav] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // 2. Notifications States
  const [emailNotif, setEmailNotif] = useState(true)
  const [remindersNotif, setRemindersNotif] = useState(true)
  const [systemNotif, setSystemNotif] = useState(true)
  const [marketingNotif, setMarketingNotif] = useState(false)

  // Doctor dynamic notifications
  const [newApptNotif, setNewApptNotif] = useState(true)
  const [schedChangeNotif, setSchedChangeNotif] = useState(true)

  // Admin dynamic notifications
  const [adminAlertsNotif, setAdminAlertsNotif] = useState(true)
  const [adminSystemNotif, setAdminSystemNotif] = useState(true)
  const [userActivityNotif, setUserActivityNotif] = useState(false)

  // 3. Accessibility States
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedAnimations, setReducedAnimations] = useState(false)

  // 4. Privacy States
  const [rememberPages, setRememberPages] = useState(true)
  const [showOnline, setShowOnline] = useState(true)
  const [shareStats, setShareStats] = useState(false)

  // Switch Toggle Helper
  const Switch = ({ checked, onChange, id, label, description }) => (
    <div className="flex items-center justify-between py-2 border-b border-border/5 last:border-0 gap-4">
      <div className="space-y-0.5">
        <label htmlFor={id} className="text-xs font-bold text-foreground cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-[10px] text-muted-foreground leading-normal">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-hidden ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in pb-12">
      {/* Return Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(`/${role}/dashboard`)}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer mb-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-primary shrink-0" />
          Application Preferences
        </h2>
        <p className="text-xs text-muted-foreground">
          Manage your interface appearance, notifications, accessibility options, and security locks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Appearance Preference */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-primary" />
              Interface Appearance
            </CardTitle>
            <CardDescription className="text-[10px]">
              Customize the look and animation styles of your HMS portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Theme Preset
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map((item) => {
                  const Icon = item.icon
                  const active = themePref === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setThemePref(item.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all duration-300 ${
                        active
                          ? "bg-primary/5 border-primary text-primary"
                          : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Switch
                id="compact-nav"
                label="Compact Navigation"
                description="Hides descriptive labels in nested panels for a cleaner sidebar."
                checked={compactNav}
                onChange={setCompactNav}
              />
              <Switch
                id="reduced-motion"
                label="Reduce Motion transitions"
                description="Bypasses page entry transitions and list expansion animations."
                checked={reducedMotion}
                onChange={setCompactNav}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Preference */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription className="text-[10px]">
              Control the notification channels and content alerts you receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <Switch
              id="notif-email"
              label="Email Notifications"
              description="Receive clinical reports and ledger billing over email."
              checked={emailNotif}
              onChange={setEmailNotif}
            />
            <Switch
              id="notif-reminders"
              label="Appointment Reminders"
              description="Get slots confirmation and rescheduled alerts reminders."
              checked={remindersNotif}
              onChange={setRemindersNotif}
            />
            <Switch
              id="notif-system"
              label="System Alerts"
              description="Receive direct warnings for security or browser updates."
              checked={systemNotif}
              onChange={setSystemNotif}
            />

            {/* Doctor specific */}
            {role === "doctor" && (
              <>
                <Switch
                  id="notif-doctor-new"
                  label="New Appointment Notifications"
                  description="Receive instant alerts when patients book a new consult slot."
                  checked={newApptNotif}
                  onChange={setNewApptNotif}
                />
                <Switch
                  id="notif-doctor-change"
                  label="Schedule Change Notifications"
                  description="Alert when patients cancel or request slot reschedules."
                  checked={schedChangeNotif}
                  onChange={setSchedChangeNotif}
                />
              </>
            )}

            {/* Admin specific */}
            {role === "admin" && (
              <>
                <Switch
                  id="notif-admin-alerts"
                  label="Administrative Alerts"
                  description="Alerts for database connection limits or API errors."
                  checked={adminAlertsNotif}
                  onChange={setAdminAlertsNotif}
                />
                <Switch
                  id="notif-admin-users"
                  label="User Activity Log Alerts"
                  description="Receive notifications of new user account creation logs."
                  checked={userActivityNotif}
                  onChange={setUserActivityNotif}
                />
              </>
            )}

            <Switch
              id="notif-marketing"
              label="Announcements & Promos"
              description="Get marketing info on hospital campaigns."
              checked={marketingNotif}
              onChange={setMarketingNotif}
            />
          </CardContent>
        </Card>

        {/* Accessibility Preference */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              Accessibility
            </CardTitle>
            <CardDescription className="text-[10px]">
              Configure assistive elements to enhance visual readability.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <Switch
              id="access-text"
              label="Large Font Sizes"
              description="Increases text rendering to optimize reader legibility."
              checked={largeText}
              onChange={setLargeText}
            />
            <Switch
              id="access-contrast"
              label="High Contrast Colors"
              description="Increases relative text and border colors for visual clarity."
              checked={highContrast}
              onChange={setHighContrast}
            />
            <Switch
              id="access-animations"
              label="Disable Animations"
              description="Bypasses visual motions to maximize performance."
              checked={reducedAnimations}
              onChange={setReducedAnimations}
            />
          </CardContent>
        </Card>

        {/* Privacy Preference */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Eye className="h-4.5 w-4.5 text-primary" />
              Privacy & Logs
            </CardTitle>
            <CardDescription className="text-[10px]">
              Manage local data caching and telemetry preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <Switch
              id="priv-recent"
              label="Remember Recent Pages"
              description="Displays historical backtracks shortcuts in dashboard layout."
              checked={rememberPages}
              onChange={setRememberPages}
            />
            <Switch
              id="priv-online"
              label="Show Online Status"
              description="Broadcast availability state to related consultants."
              checked={showOnline}
              onChange={setShowOnline}
            />
            <Switch
              id="priv-share"
              label="Anonymous Usage Stats"
              description="Share error traces and page loads times to help improvements."
              checked={shareStats}
              onChange={setShareStats}
            />
          </CardContent>
        </Card>

        {/* Security Preferences */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-primary" />
              Account Security
            </CardTitle>
            <CardDescription className="text-[10px]">
              Review encryption, change credentials, and sign out session controls.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {[
              { title: "Change Password", desc: "Update your current auth credentials." },
              { title: "Two-Factor Authentication", desc: "Add SMS verification locks." },
              { title: "Active Devices & Sessions", desc: "View all active portal logins." },
            ].map((sec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 border rounded-xl border-border/40 bg-muted/10 opacity-75 hover:opacity-90 transition-opacity"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">{sec.title}</span>
                  <p className="text-[10px] text-muted-foreground">{sec.desc}</p>
                </div>
                <Badge variant="outline" className="text-[8px] font-extrabold uppercase bg-muted/40 select-none shrink-0">
                  Coming Soon
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* About App Preferences */}
        <Card className="border border-border/40 shadow-2xs bg-card rounded-2xl overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Info className="h-4.5 w-4.5 text-primary" />
              About HMS Portal
            </CardTitle>
            <CardDescription className="text-[10px]">
              Metadata and legal disclosures of the Hospital Management Portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex flex-col justify-between h-[255px]">
            {/* Version Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: "Application Name", val: "HMS Portal" },
                { label: "Portal Version", val: "v1.2.0-beta" },
                { label: "Environment Mode", val: import.meta.env.MODE },
                { label: "Portal Build Date", val: "2026-06-27" },
              ].map((info, idx) => (
                <div key={idx} className="bg-muted/10 p-2.5 rounded-xl border border-border/5">
                  <span className="text-[9px] text-muted-foreground font-bold uppercase block tracking-wider">
                    {info.label}
                  </span>
                  <span className="font-extrabold text-foreground mt-0.5 block capitalize">
                    {info.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Legal Placeholders buttons */}
            <div className="grid grid-cols-3 gap-2 border-t pt-4">
              {["Privacy Policy", "Terms of Service", "Licenses"].map((btn, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="text-[10px] font-bold border-border/15 rounded-xl flex items-center gap-1 cursor-pointer"
                  onClick={() => alert(`Opening ${btn} placeholder window`)}
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{btn.replace(" of Service", "")}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
