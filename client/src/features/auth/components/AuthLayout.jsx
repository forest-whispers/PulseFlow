export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center py-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center mb-4">
          <img src="/icon.svg" alt="PulseFlow" className="h-10 w-auto" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 border shadow-sm sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  )
}
