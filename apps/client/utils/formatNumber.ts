export function formatNumberKo(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "만";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "천";
  } else {
    return num + "";
  }
}
