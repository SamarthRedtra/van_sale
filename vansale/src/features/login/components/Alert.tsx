const Alert = ({ children, variant = "default", className, ...props }: any) => {
  const variantClasses = {
    default: "bg-blue-100 text-blue-900",
    destructive: "bg-red-100 text-red-900",
  };
  return (
    <div
      role="alert"
      // @ts-ignore
      className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertTitle = ({ className, ...props }: any) => (
  <h5
    className={`mb-1 font-medium leading-none tracking-tight ${className}`}
    {...props}
  />
);

const AlertDescription = ({ className, ...props }: any) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
);

export { Alert, AlertTitle, AlertDescription };
