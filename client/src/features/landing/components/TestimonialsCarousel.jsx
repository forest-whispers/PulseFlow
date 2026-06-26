import { Star } from "lucide-react"

// Testimonials data set 1 (Left scrolling row)
const ROW_ONE = [
  {
    name: "Emily Watson",
    role: "Patient",
    avatarText: "EW",
    rating: 5,
    text: "Booking a slot with my cardiologist took less than 2 minutes. The platform is extremely straightforward to use!",
  },
  {
    name: "Dr. Robert Chen",
    role: "Consultant",
    avatarText: "RC",
    rating: 5,
    text: "The patient records integration allows me to inspect medical histories before consultations. Highly efficient portal.",
  },
  {
    name: "Sarah Miller",
    role: "Patient",
    avatarText: "SM",
    rating: 5,
    text: "Receiving lab reports directly on my phone saves so much time. I don't have to wait or call the clinic anymore.",
  },
  {
    name: "James Anderson",
    role: "Patient",
    avatarText: "JA",
    rating: 4,
    text: "Great experience. The notification system warned me about a scheduling exception and helped me reschedule easily.",
  },
]

// Testimonials data set 2 (Right scrolling row)
const ROW_TWO = [
  {
    name: "Maria Lopez",
    role: "Patient",
    avatarText: "ML",
    rating: 5,
    text: "The layout looks clean, minimal, and modern. Managing prescriptions and lab history has never been this simple.",
  },
  {
    name: "David Kim",
    role: "Patient",
    avatarText: "DK",
    rating: 5,
    text: "Securing appointments for my family members is quick and simple. A truly modern healthcare solution.",
  },
  {
    name: "Dr. Linda Benson",
    role: "General Physician",
    avatarText: "LB",
    rating: 5,
    text: "My dashboard organizes availability slot durations and patient queues perfectly. Minimizes clinical downtime.",
  },
  {
    name: "Amanda Cross",
    role: "Patient",
    avatarText: "AC",
    rating: 5,
    text: "Theme switching, clean forms, and instant toast confirmations make the portal a joy to use.",
  },
]

export default function TestimonialsCarousel() {
  // Duplicate datasets to achieve seamless loop animation
  const rowOneItems = [...ROW_ONE, ...ROW_ONE]
  const rowTwoItems = [...ROW_TWO, ...ROW_TWO]

  return (
    <section id="testimonials" className="py-16 bg-background overflow-hidden border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            What Patients and Doctors Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Read testimonials from active members of our digital healthcare community.
          </p>
        </div>
      </div>

      {/* Marquee Wrapper Container */}
      <div className="flex flex-col gap-6 w-full select-none">
        
        {/* Row 1: Scrolling Left */}
        <div className="relative flex w-full overflow-hidden py-2">
          {/* Marquee container with CSS translation animation */}
          <div className="flex gap-6 animate-marquee-left hover:[animation-play-state:paused]">
            {rowOneItems.map((item, index) => (
              <div
                key={`r1-${index}`}
                className="w-[300px] sm:w-[350px] shrink-0 border bg-card rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-primary/30 transition-colors"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>
                
                {/* User Info */}
                <div className="flex items-center gap-3 mt-4 border-t pt-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 border flex items-center justify-center text-xs font-semibold text-primary">
                    {item.avatarText}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground leading-none">{item.name}</div>
                    <span className="text-xs text-muted-foreground">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="relative flex w-full overflow-hidden py-2">
          {/* Marquee container with CSS translation animation */}
          <div className="flex gap-6 animate-marquee-right hover:[animation-play-state:paused]">
            {rowTwoItems.map((item, index) => (
              <div
                key={`r2-${index}`}
                className="w-[300px] sm:w-[350px] shrink-0 border bg-card rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-primary/30 transition-colors"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 mt-4 border-t pt-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 border flex items-center justify-center text-xs font-semibold text-primary">
                    {item.avatarText}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground leading-none">{item.name}</div>
                    <span className="text-xs text-muted-foreground">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
