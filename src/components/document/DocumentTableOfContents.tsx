
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface DocumentTableOfContentsProps {
  content: string;
}

const generateTableOfContents = (content: string): TocItem[] => {
  if (!content) return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  return Array.from(headings).map((heading, index) => ({
    id: `heading-${index}`,
    text: heading.textContent || '',
    level: parseInt(heading.tagName[1]),
  }));
};

const scrollToHeading = (text: string) => {
  const headings = document.querySelectorAll('#pdf-export-area h1, #pdf-export-area h2, #pdf-export-area h3, #pdf-export-area h4, #pdf-export-area h5, #pdf-export-area h6');
  const targetHeading = Array.from(headings).find(h => {
    const element = h as HTMLElement;
    return element.textContent === text;
  });
  
  if (targetHeading) {
    const element = targetHeading as HTMLElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const DocumentTableOfContents: React.FC<DocumentTableOfContentsProps> = ({ content }) => {
  const isMobile = useIsMobile();
  const [tocOpen, setTocOpen] = useState(!isMobile);
  const tableOfContents = generateTableOfContents(content);

  if (tableOfContents.length === 0) {
    return null;
  }

  return (
    <div className="lg:col-span-3 no-print">
      <Collapsible open={tocOpen} onOpenChange={setTocOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full mb-4 lg:hidden bg-white shadow-sm">
            Table of Contents
            {tocOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="sticky top-6 bg-white/90 backdrop-blur-sm shadow-lg border-blue-100">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="text-sm font-medium flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Contents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 max-h-96 overflow-y-auto">
              <nav className="space-y-2 py-4">
                {tableOfContents.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToHeading(item.text)}
                    className={`block text-left text-sm hover:text-blue-600 transition-all duration-200 w-full rounded-md p-2 hover:bg-blue-50 ${
                      item.level === 1 ? 'font-semibold text-blue-900 text-base' :
                      item.level === 2 ? 'ml-3 font-medium text-blue-800' :
                      item.level === 3 ? 'ml-6 text-blue-700' :
                      'ml-9 text-blue-600'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DocumentTableOfContents;
