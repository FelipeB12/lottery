/**
 * Formats a number as a currency string with a consistent locale to prevent hydration mismatches.
 * Uses Spanish (Dominican Republic) formatting by default.
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-DO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Formats a date string with a consistent locale to prevent hydration mismatches.
 */
export function formatDate(date: Date | string | number): string {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-DO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(d);
}
