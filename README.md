
# DeepWaters - AI-Powered Document Management

A sophisticated document management application with comprehensive AI integration powered by Azure OpenAI.

## Features

### Core Functionality
- **Document Management**: Create, edit, and organize documents with rich text editing
- **Folder Organization**: Hierarchical folder structure for document organization
- **Book Writing**: Specialized interface for long-form content creation
- **Calendar Integration**: Schedule and track document-related tasks
- **Search**: Global search across all documents and content

### AI Integration (Azure OpenAI)
- **Content Generation**: AI-powered text generation with contextual prompts
- **Document Analysis**: Automatic summarization, insights, and keyword extraction
- **Content Enhancement**: Grammar correction, style improvement, and content expansion
- **Idea Generation**: Brainstorming and creative ideation assistance
- **Grand Strategist**: Conversational AI assistant with document context awareness
- **AI Playground**: Interactive environment for exploring AI capabilities

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Supabase (Authentication, Database, Edge Functions)
- **AI**: Azure OpenAI (GPT-4o)
- **Styling**: Tailwind CSS + shadcn/ui
- **Rich Text**: TipTap editor with custom extensions
- **State Management**: React Query + Context API
- **Routing**: React Router DOM

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Azure OpenAI resource
- Supabase project (optional, for user accounts and data persistence)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd deepwaters
   npm install
   ```

2. **Configure Azure OpenAI**
   
   Copy the environment template:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Azure OpenAI credentials:
   ```env
   VITE_AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
   VITE_AZURE_OPENAI_KEY=your-api-key-here
   VITE_AZURE_OPENAI_VERSION=2024-05-01-preview
   VITE_AZURE_OPENAI_MODEL=gpt-4o
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:8080`

### Azure OpenAI Setup

1. **Create Azure OpenAI Resource**
   - Go to the Azure Portal
   - Create a new Azure OpenAI resource
   - Deploy a GPT-4o model
   - Note your endpoint and API key

2. **Environment Configuration**
   - Set the required environment variables in your `.env` file
   - For production deployment, configure these in your hosting platform

## AI Features Usage

### AI Playground
Visit `/ai-playground` to explore all AI capabilities:
- **Generate**: Create content from prompts
- **Analyze**: Extract insights from existing content
- **Enhance**: Improve grammar, style, and clarity
- **Ideas**: Brainstorm creative solutions

### Document Integration
AI features are integrated throughout the application:
- Document analysis and enhancement in the editor
- Context-aware AI assistance
- Automatic content suggestions
- Intelligent search and recommendations

### Grand Strategist
Access the conversational AI assistant at `/grand-strategist`:
- Chat-based interaction with your documents
- Document-aware responses
- Conversation history persistence
- Multi-document analysis

## Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Navigation and layout components
│   └── AIAssistant.tsx # Main AI integration component
├── hooks/              # Custom React hooks
│   └── useAzureAI.ts   # Azure OpenAI integration hooks
├── pages/              # Route components
├── services/           # API and external service integrations
│   └── azureAIService.ts # Azure OpenAI service layer
├── contexts/           # React context providers
└── types/              # TypeScript type definitions
```

### Key AI Components

- **AIAssistant**: Comprehensive AI interface component
- **azureAIService**: Service layer for Azure OpenAI API
- **useAzureAI hooks**: React hooks for AI functionality
- **AI Playground**: Interactive testing environment

### Build and Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Security Considerations

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use secure environment variable management
- **Rate Limiting**: Implement appropriate usage controls
- **Data Privacy**: Handle user content securely

## Performance Optimization

- **Code Splitting**: Routes are lazy-loaded
- **API Caching**: React Query provides intelligent caching
- **Bundle Optimization**: Vite optimizes production builds
- **Image Optimization**: Use appropriate image formats and sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the documentation
- Review existing GitHub issues
- Create a new issue with detailed information

---

**Note**: This application demonstrates advanced AI integration patterns and can serve as a foundation for AI-powered document management solutions.
