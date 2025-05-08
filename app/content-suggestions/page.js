import ContentSuggestionForm from '@/components/ContentSuggestionForm';
import Link from 'next/link';

export default function ContentSuggestionsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Content Suggestions</h1>
        <Link 
          href="/saved-suggestions"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Saved Suggestions
        </Link>
      </div>
      <div className="max-w-4xl mx-auto">
        <ContentSuggestionForm />
      </div>
    </div>
  );
} 