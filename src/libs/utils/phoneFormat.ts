export const formatPhoneNumber = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length < 4) return digitsOnly;
    if (digitsOnly.length < 8) {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    }
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 11)}`;
  };