
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from '@/components/ui/layout';
import { getDocument, updateDocument } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import GrandStrategistAssistant from '@/components/GrandStrategistAssistant';
import { useDocumentExporter } from '@/hooks/use-document-exporter';
import DocumentHeader from '@/components/document/DocumentHeader';
import DocumentTableOfContents from '@/components/document/DocumentTableOfContents';
import DocumentContent from '@/components/document/DocumentContent';

const ViewDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [showAI, setShowAI] = useState(true);
  const { isExporting, exportToPdf } = useDocumentExporter();

  useEffect(() => {
    if (id) {
      loadDocument();
      setShowAI(true);
    }
  }, [id]);

  const loadDocument = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const docData = await getDocument(id);
      setDocument(docData);
      setContent(docData.content || '');
      setTitle(docData.title || '');
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Failed to load document');
      navigate('/documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    
    try {
      setIsSaving(true);
      await updateDocument(id, { 
        title: title.trim(),
        content: content 
      });
      
      await loadDocument();
      
      setIsEditing(false);
      toast.success('Document saved successfully');
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (document) {
      exportToPdf('pdf-export-area', document.title);
    }
  };

  const handlePrint = () => {
    window.print();
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setContent(document.content || '');
    setTitle(document.title || '');
  };

  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
  const tocExists = /<h[1-6]/.test(content);

  if (isLoading) {
    return (
      <Layout className="bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-blue-200 rounded mb-4"></div>
            <div className="h-64 bg-blue-100 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!document) {
    return (
      <Layout className="bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Document not found</h1>
            <p className="text-gray-600 mb-6">The document you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/documents">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Documents
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 no-print">
          <Button variant="ghost" asChild className="mb-4 text-blue-600 hover:text-blue-800">
            <Link to="/documents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documents
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {tocExists && <DocumentTableOfContents content={content} />}

          <div className={`${tocExists ? 'lg:col-span-6' : 'lg:col-span-9'}`}>
            <Card className="border-blue-200 shadow-xl bg-white/95 backdrop-blur-sm print-section">
              <DocumentHeader
                document={document}
                title={title}
                wordCount={wordCount}
                isEditing={isEditing}
                isSaving={isSaving}
                isExporting={isExporting}
                showAI={showAI}
                onTitleChange={setTitle}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                onEdit={() => setIsEditing(true)}
                onExportPDF={handleExportPDF}
                onPrint={handlePrint}
                onToggleAI={() => setShowAI(!showAI)}
              />
              <DocumentContent
                isEditing={isEditing}
                content={content}
                onContentChange={setContent}
                document={document}
              />
            </Card>
          </div>

          {showAI && (
            <div className="lg:col-span-3 no-print">
              <GrandStrategistAssistant
                context={content}
                documentId={id}
                documentTitle={title}
                className="sticky top-6 h-[600px] flex flex-col shadow-xl"
                variant="document"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ViewDocument;
