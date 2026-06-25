import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <div className="w-full max-w-md border rounded-lg p-6 shadow-sm bg-card">
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <p className="text-sm text-muted-foreground mb-6">
          This is a login page placeholder.
        </p>
        <div className="flex flex-col gap-4">
          <Button className="w-full">Sign In</Button>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="underline hover:text-primary">
              Register
            </Link>
          </div>
          <div className="text-center text-sm mt-4">
            <Link to="/" className="underline hover:text-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
