export default function cls(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ")
}