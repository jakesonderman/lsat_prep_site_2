import NextAuth from 'next-auth';
import { authOptions } from '../../../lib/auth';

// Create NextAuth handler with the options
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET, handler as POST }; 