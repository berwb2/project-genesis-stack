import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFolder, listDocuments, deleteDocument, updateFolder } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import MobileNav from '@/components/MobileNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FileText, FolderOpen, MoreVertical, Plus, Trash, Edit, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ContentLoader from '@/components/ContentLoader';

const FolderView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  
  const { data: folder, isLoading: isFolderLoading } = useQuery({
    queryKey: ['folder', id],
    queryFn: () => getFolder(id!),
    enabled: !!id,
  });
  
  const { data: documentsData, isLoading: isDocumentsLoading } = useQuery({
    queryKey: ['folder-documents', id],
    queryFn: () => listDocuments({ folder_id: id }),
    enabled: !!id,
  });
  
  useEffect(() => {
    if (folder) {
      setFolderName(folder.name);
    }
  }, [folder]);
  
  const updateFolderMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateFolder(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder', id] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast({
        title: 'Folder renamed',
        description: 'The folder has been renamed successfully.',
      });
      setIsRenameDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to rename folder. Please try again.',
        variant: 'destructive',
      });
      console.error('Error renaming folder:', error);
    },
  });
  
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folder-documents', id] });
      toast({
        title: 'Document deleted',
        description: 'The document has been deleted successfully.',
      });
      setDocumentToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete document. Please try again.',
        variant: 'destructive',
      });
      console.error('Error deleting document:', error);
    },
  });
  
  const handleRenameFolder = () => {
    if (folderName.trim() && id) {
      updateFolderMutation.mutate({ id, name: folderName.trim() });
    }
  };
  
  const handleDeleteDocument = () => {
    if (documentToDelete) {
      deleteDocumentMutation.mutate(documentToDelete);
    }
  };
  
  const isLoading = isFolderLoading || isDocumentsLoading;
  const documents = documentsData?.documents || [];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileNav />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {!isMobile && <Sidebar />}
        
        <main className={`flex-1 ${isMobile ? 'px-4 pt-20 pb-6' : 'p-8'} overflow-y-auto`}>
          {isLoading ? (
            <ContentLoader />
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate('/folders')} className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center">
                    <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                    <h1 className="text-2xl font-bold">{folder?.name}</h1>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Rename Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 dark:text-red-400">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Folder
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="mb-6">
                <Button asChild>
                  <Link to={`/create?folder=${id}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Document
                  </Link>
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <div className="text-center py-8">
                      <FolderOpen className="h-12 w-12 mx-auto text-blue-300 dark:text-blue-500 mb-3" />
                      <h3 className="text-lg font-medium mb-2">This folder is empty</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Create your first document in this folder
                      </p>
                      <Button asChild>
                        <Link to={`/create?folder=${id}`}>
                          <Plus className="h-4 w-4 mr-2" />
                          New Document
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Link to={`/documents/${doc.id}`} className="flex items-center flex-1 min-w-0">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                            <div className="min-w-0">
                              <h4 className="font-medium truncate">{doc.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Updated {formatDate(doc.updated_at)}
                              </p>
                            </div>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              setDocumentToDelete(doc.id);
                            }}
                          >
                            <Trash className="h-4 w-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
      
      {/* Rename Folder Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="mb-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameFolder} disabled={!folderName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Document Confirmation */}
      <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Folder Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this folder and all its contents? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // Handle folder deletion
                navigate('/folders');
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FolderView;
