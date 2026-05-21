export const formatCurrency = (value: unknown): string => {
  const num = Number(value);
  if (isNaN(num)) return String(value ?? "");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (value: unknown): string => {
  if (value == null) return "";
  const date = new Date(String(value));
  if (isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const getNestedValue = (
  obj: Record<string, unknown>,
  path: string,
): unknown => {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (
      acc !== null &&
      acc !== undefined &&
      typeof acc === "object" &&
      key in (acc as Record<string, unknown>)
    ) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

export const generateFilterId = () => crypto.randomUUID();

export const debounce = <T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
