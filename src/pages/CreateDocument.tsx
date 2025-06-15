
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from '@/components/RichTextEditor';
import DocumentRenderer from '@/components/document/DocumentRenderer';
import Layout from '@/components/ui/layout';
import { useDocumentActions } from '@/hooks/use-document-actions';
import { DOCUMENT_TYPES, DocumentType, getDocumentTypeTemplate } from '@/types/documentTypes';
import { ArrowLeft, Eye, Edit, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import GrandStrategistAssistant from '@/components/GrandStrategistAssistant';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CreateDocument = () => {
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get('folderId');
  
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('markdown');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const navigate = useNavigate();
  const { createDocumentWithSound } = useDocumentActions();

  // Initialize content with template when document type changes
  React.useEffect(() => {
    const template = getDocumentTypeTemplate(documentType);
    setContent(template);
  }, [documentType]);

  const handleDocumentTypeChange = (type: DocumentType) => {
    setDocumentType(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a document title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please add some content to your document");
      return;
    }

    setIsSubmitting(true);

    try {
      const documentId = await createDocumentWithSound({
        title: title.trim(),
        content,
        content_type: documentType,
        is_template: false,
        metadata: folderId ? { folder_id: folderId } : {}
      });
      
      // toast is already shown in useDocumentActions
      navigate(`/documents/${documentId}`);
    } catch (error) {
      console.error("Error creating document:", error);
      // toast is already shown in useDocumentActions
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Layout className="bg-gradient-to-br from-blue-50 to-teal-50" mainClassName="p-0 md:p-6">
      <div className="w-full md:max-w-7xl md:mx-auto">
        <Alert variant="destructive" className="m-4 md:m-0 md:mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Maintenance Notice</AlertTitle>
            <AlertDescription>
              The app is undergoing major issues, please be aware maintenance is underway.
            </AlertDescription>
        </Alert>

        <div className="mb-6 px-4 md:px-0">
          <Button variant="ghost" asChild className="mb-4 text-blue-600 hover:text-blue-800">
            <Link to={folderId ? `/folders/${folderId}` : "/documents"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {folderId ? 'Folder' : 'Documents'}
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 md:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-9">
              <Card className="border-blue-200 shadow-xl bg-white/95 backdrop-blur-sm md:rounded-xl">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-grow space-y-2">
                      <Label htmlFor="title" className="sr-only">Document Title</Label>
                      <Input
                        id="title"
                        placeholder="My Awesome Document Title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-3xl font-bold h-auto p-0 border-none focus-visible:ring-0 shadow-none bg-transparent tracking-tight"
                        required
                      />
                    </div>

                    <div className="space-y-2 flex-shrink-0">
                      <Label htmlFor="documentType" className="text-blue-700 font-semibold text-xs">Document Type</Label>
                      <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                        <SelectTrigger id="documentType" className="w-full md:w-[200px] border-blue-200 focus:border-blue-400 h-9">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={type.color}>
                                  {type.name}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {type.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="border-y border-blue-200 bg-blue-50/50 px-6 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={!previewMode ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setPreviewMode(false)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant={previewMode ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setPreviewMode(true)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {wordCount} words
                    </div>
                  </div>
                  {previewMode ? (
                    <DocumentRenderer content={content} />
                  ) : (
                    <RichTextEditor 
                      content={content} 
                      onChange={setContent} 
                      placeholder="Start writing your document content here..." 
                      editable={true}
                    />
                  )}
                </CardContent>

                <CardFooter className="flex justify-end space-x-4 bg-gray-50/50">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(folderId ? `/folders/${folderId}` : '/documents')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Document'}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-3 no-print">
              <GrandStrategistAssistant
                context={content}
                className="sticky top-6 h-[600px] flex flex-col shadow-xl"
                variant="document"
              />
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateDocument;
