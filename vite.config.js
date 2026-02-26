// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite";
// import basicSsl from "@vitejs/plugin-basic-ssl";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss(), basicSsl()],
//   server: {
//     host: "localhost",
//     hmr: {
//       host: "localhost",
//       protocol: "wss",
//       clientPort:5173
//     },
//   }
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
// import basicSsl from "@vitejs/plugin-basic-ssl"; // 1. Comment out or remove this import

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    // basicSsl() // 2. Remove the plugin from the list
  ],
  server: {
    host: "localhost",
    https: false, // 3. Explicitly set https to false
    hmr: {
      host: "localhost",
      protocol: "ws", // 4. Change 'wss' (secure) to 'ws' (standard)
      clientPort: 5173
    },
  }
});
