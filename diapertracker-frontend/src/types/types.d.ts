declare global {
  interface Window {
    google: import('@types/google.accounts')
    FB: import('@types/facebook-js-sdk')
  }
}
