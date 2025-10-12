/* eslint-disable no-console */
import { TabServerTransport } from '@mcp-b/transports'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

// Types for better type safety
interface McpServerInstance {
  server: McpServer
  cleanup: () => Promise<void>
  isCountToolsRegistered: Ref<boolean>
}

interface McpServerError extends Error {
  code?: string
  details?: unknown
}

// Global singleton instance
let serverInstance: McpServer | null = null
let serverPromise: Promise<McpServer> | null = null
let cleanupFunctions: (() => Promise<void>)[] = []
const isCountToolsRegistered = ref(false)

export async function useMcpServer(): Promise<McpServerInstance> {
  // Return existing instance if already created
  if (serverInstance) {
    console.log('returning existing MCP server instance')
    return {
      server: serverInstance,
      cleanup: () => cleanupServer(),
      isCountToolsRegistered,
    }
  }

  // Return existing promise if server is being created
  if (serverPromise) {
    console.log('waiting for MCP server instance to be created')
    const server = await serverPromise
    return {
      server,
      cleanup: () => cleanupServer(),
      isCountToolsRegistered,
    }
  }

  // Create new instance with proper error handling
  console.log('creating MCP server instance in composable')
  serverPromise = createServerInstance()

  try {
    const server = await serverPromise
    return {
      server,
      cleanup: () => cleanupServer(),
      isCountToolsRegistered,
    }
  }
  catch (error) {
    // Reset promise on failure to allow retry
    serverPromise = null
    throw error
  }
}

async function createServerInstance(): Promise<McpServer> {
  try {
    const server = new McpServer({
      name: 'mcp-server-composable',
      version: '1.0.0',
    })

    // a tool needs to be registered before connecting the transport
    // otherwise an error will be thrown when trying to register tools
    // elsewhere like in index.vue and/or app.vue
    server.tool('sayHello', 'Says hello', {
      name: z.string().min(1, 'Name cannot be empty'),
    }, async ({ name }) => {
      return {
        content: [{ type: 'text', text: `Hello ${name}!` }],
      }
    })

    console.log('Tools defined, connecting transport...')

    // Get allowed origins from runtime config or environment
    const config = useRuntimeConfig()
    const allowedOrigins = typeof config.public?.mcpAllowedOrigins === 'string'
      ? config.public.mcpAllowedOrigins
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean)
      : [
          'http://localhost:3000',
          'http://127.0.0.1:8788',
          'http://localhost:8788',
          'https://mcp-b-shop.pages.dev/'
        ] // Safe default for local dev and Wrangler Pages

    const transport = new TabServerTransport({
      allowedOrigins,
    })

    await server.connect(transport)
    console.log('Transport connected successfully')

    // Store cleanup function
    cleanupFunctions.push(async () => {
      try {
        await transport.close()
        console.log('Transport closed')
      }
      catch (error) {
        console.error('Error closing transport:', error)
      }
    })

    serverInstance = server
    return server
  }
  catch (error) {
    const mcpError: McpServerError = error instanceof Error
      ? error
      : new Error('Unknown error creating MCP server')

    mcpError.code = 'MCP_SERVER_CREATION_FAILED'
    mcpError.details = error

    console.error('Failed to create MCP server:', mcpError)
    throw mcpError
  }
}

async function cleanupServer(): Promise<void> {
  try {
    console.log('Cleaning up MCP server...')

    // Run all cleanup functions
    await Promise.allSettled(
      cleanupFunctions.map(cleanup => cleanup()),
    )

    // Reset state
    serverInstance = null
    serverPromise = null
    cleanupFunctions = []

    console.log('MCP server cleanup completed')
  }
  catch (error) {
    console.error('Error during MCP server cleanup:', error)
    throw error
  }
}

// Nuxt plugin cleanup hook (optional)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    cleanupServer().catch(console.error)
  })
}
