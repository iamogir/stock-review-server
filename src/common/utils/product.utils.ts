export const formatString = (str: string) => {
  str = str.toLowerCase();
  return str.replace(/^./, (m) => m.toUpperCase());
}