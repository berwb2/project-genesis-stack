
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Calendar, Clock, MessageSquare, Download, Printer } from 'lucide-react';
import { DOCUMENT_TYPES } from '@/types/documentTypes';

interface DocumentHeaderProps {
  document: any;
  title: string;
  wordCount: number;
  isEditing: boolean;
  isSaving: boolean;
  isExporting: boolean;
  showAI: boolean;
  onTitleChange: (newTitle: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  onToggleAI: () => void;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  document,
  title,
  wordCount,
  isEditing,
  isSaving,
  isExporting,
  showAI,
  onTitleChange,
  onSave,
  onCancel,
  onEdit,
  onExportPDF,
  onPrint,
  onToggleAI,
}) => {
  const documentType = DOCUMENT_TYPES.find(type => type.id === document.content_type) || DOCUMENT_TYPES[0];

  return (
    <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white print-section-header">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="text-xl sm:text-2xl font-bold bg-white/20 border border-white/30 outline-none focus:ring-2 focus:ring-white/50 rounded-lg px-3 py-2 w-full text-white placeholder-white/70 no-print"
                placeholder="Document title..."
              />
            ) : (
              <CardTitle className="text-xl sm:text-2xl text-white break-words leading-tight">
                {document.title}
              </CardTitle>
            )}
          </div>
          
          <div className="flex items-center space-x-2 no-print">
            <Button
              variant="secondary"
              size="sm"
              onClick={onToggleAI}
              className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {showAI ? 'Hide' : 'Show'} AI
            </Button>
            
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={isSaving || !title.trim()}
                  className="bg-white text-blue-600 hover:bg-white/90"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                 <Button
                  size="sm"
                  onClick={onPrint}
                  className="bg-white text-blue-600 hover:bg-white/90 flex-shrink-0"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                 <Button
                  size="sm"
                  onClick={onExportPDF}
                  disabled={isExporting}
                  className="bg-white text-blue-600 hover:bg-white/90 flex-shrink-0"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </Button>
                <Button
                  size="sm"
                  onClick={onEdit}
                  className="bg-white text-blue-600 hover:bg-white/90 flex-shrink-0"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Badge variant="secondary" className={`${documentType.color} bg-white/20 text-white border-white/30 badge-print`}>
            {documentType.name}
          </Badge>
          
          <div className="flex items-center text-white/90">
            <Calendar className="mr-1 h-3 w-3" />
            <span className="hidden sm:inline">Created </span>
            {new Date(document.created_at).toLocaleDateString()}
          </div>
          
          <div className="flex items-center text-white/90">
            <Clock className="mr-1 h-3 w-3" />
            <span className="hidden sm:inline">Updated </span>
            {new Date(document.updated_at).toLocaleString()}
          </div>
          
          <div className="flex items-center text-white/90">
            <span>{wordCount} words</span>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

export default DocumentHeader;
