type Props = {
  kind?: "info" | "success" | "warning" | "error";
  children: React.ReactNode;
};

const styles: Record<NonNullable<Props["kind"]>, string> = {
  info: "bg-blue-50 text-blue-800 border-blue-200",
  success: "bg-green-50 text-green-800 border-green-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  error: "bg-red-50 text-red-800 border-red-200",
};

export default function Alert({ kind = "info", children }: Props) {
  return (
    <div className={`border rounded px-3 py-2 ${styles[kind]}`}>
      {children}
    </div>
  );
}

