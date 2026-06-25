/// <reference types="vite/client" />

// View Transitions API (not yet in lib.dom for our TS target).
interface ViewTransition {
  finished: Promise<void>
  ready: Promise<void>
  updateCallbackDone: Promise<void>
  skipTransition: () => void
}

interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition
}
