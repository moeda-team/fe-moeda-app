export {}

declare global {
  interface Window {
    AndroidPrinter?: {
      print: (text: string) => void
    }
  }
}