export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 33C26.2843 33 33 26.2843 33 18C33 9.71573 26.2843 3 18 3C9.71573 3 3 9.71573 3 18C3 26.2843 9.71573 33 18 33Z"
        className="fill-primary"
      />
      <path
        d="M14.25 12H23.25V15H17.25V19.5H21.75V22.5H17.25V27H14.25V12Z"
        className="fill-primary-foreground"
      />
    </svg>
  );
}
