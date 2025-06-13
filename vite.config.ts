
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Make sure Azure OpenAI environment variables are available to the client
    'import.meta.env.VITE_AZURE_OPENAI_ENDPOINT': JSON.stringify(process.env.VITE_AZURE_OPENAI_ENDPOINT),
    'import.meta.env.VITE_AZURE_OPENAI_KEY': JSON.stringify(process.env.VITE_AZURE_OPENAI_KEY),
    'import.meta.env.VITE_AZURE_OPENAI_VERSION': JSON.stringify(process.env.VITE_AZURE_OPENAI_VERSION),
    'import.meta.env.VITE_AZURE_OPENAI_MODEL': JSON.stringify(process.env.VITE_AZURE_OPENAI_MODEL),
  },
  // Ensure environment variables are loaded for the build process
  envPrefix: ['VITE_'],
})
