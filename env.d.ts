declare module 'h3' {
  interface H3EventContext {
    cf?: {
      cloudflare?: {
        request: Request
        // env is optional and empty when you have no bindings configured
        env?: Record<string, unknown>
        context: ExecutionContext
      }
    }
  }
}
