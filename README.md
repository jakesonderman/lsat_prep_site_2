# LSAT Prep Notebook

A digital notebook application for LSAT preparation, helping law school applicants track their study progress, document wrong answers, set goals, and visualize score improvements.

## Features

- **Dashboard**: Overview of all study tools and quick navigation
- **Study Calendar**: Plan and track study sessions
- **Wrong Answer Journal**: Document and analyze incorrect questions
- **Goal Tracking**: Set and monitor LSAT preparation milestones
- **Score Progress**: Visualize practice test score improvements
- **User Authentication**: Register, log in, and manage your profile
- **User Data Tracking**: Save your progress across devices and sessions

## Screenshots

*Coming soon*

## Tech Stack

- **Framework**: Next.js 14
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Authentication**: NextAuth.js, JWT
- **Database**: MongoDB
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (for full functionality)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/lsat-prep-notebook.git
   cd lsat-prep-notebook
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```
npm run build
```

### Deployment

The site is configured for deployment on Netlify. Push to the main branch to trigger automatic deployment.

```
npm run deploy
```

## Project Structure

- `app/`: Next.js app directory
  - `components/`: Reusable UI components
  - `context/`: React context providers
  - `lib/`: Utility functions and models
  - `api/`: API routes
  - `auth/`: Authentication pages
  - `calendar/`: Study calendar feature
  - `wrong-answers/`: Wrong answer journal feature
  - `goals/`: Goal tracking feature
  - `progress/`: Score progress visualization
  - `profile/`: User profile management
- `public/`: Static assets

## Data Persistence

The application supports two modes of data persistence:

1. **Authenticated Users**: Data is stored in MongoDB and synchronized across devices
2. **Guest Users**: Data is stored in local storage and available only on the current device

## Roadmap

- Complete authentication system
- Study timer functionality
- Practice test generator
- Study group integration
- Mobile app version

See the [Planning.md](./Planning.md) file for detailed development plans.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts](https://recharts.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [MongoDB](https://www.mongodb.com/) 