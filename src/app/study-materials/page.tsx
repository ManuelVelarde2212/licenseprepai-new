"use client";

import { useState, ChangeEvent } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, UploadCloud, Trash2, FileType, Search } from 'lucide-react';
import type { StudyMaterial } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const initialMaterials: StudyMaterial[] = [
  { id: '1', name: 'Cardiology Basics.pdf', type: 'PDF', uploadDate: '2024-07-15', content: 'Cardiology is the study of the heart...' },
  { id: '2', name: 'Renal Physiology Notes.docx', type: 'DOC', uploadDate: '2024-07-10', content: 'The kidneys are vital organs...' },
  { id: '3', name: 'Endocrine System Overview.pptx', type: 'PPT', uploadDate: '2024-07-05', content: 'The endocrine system produces hormones...' },
];

export default function StudyMaterialsPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>(initialMaterials);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: 'No file selected', description: 'Please select a file to upload.', variant: 'destructive' });
      return;
    }

    // Mock upload process
    // In a real app, you would read file content here or send to server
    // For now, just add to list with placeholder content
    const newMaterial: StudyMaterial = {
      id: String(Date.now()),
      name: selectedFile.name,
      type: selectedFile.name.split('.').pop()?.toUpperCase() as StudyMaterial['type'] || 'TXT',
      uploadDate: new Date().toISOString().split('T')[0],
      content: `Content of ${selectedFile.name}. This is placeholder text.`,
    };
    setMaterials(prev => [newMaterial, ...prev]);
    setSelectedFile(null);
    // Clear the file input (this is a bit tricky, might need a ref or key change)
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    toast({ title: 'File Uploaded', description: `${selectedFile.name} has been added to your materials.`, variant: 'default' });
  };

  const handleDelete = (materialId: string) => {
    setMaterials(prev => prev.filter(m => m.id !== materialId));
    toast({ title: 'Material Deleted', description: `Material has been removed.`, variant: 'default' });
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Study Materials" description="Upload and manage your study documents." icon={FileText} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UploadCloud className="text-primary" />Upload New Material</CardTitle>
          <CardDescription>Add PDF, DOC, or PPT files to your study library. Max 5MB.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input id="file-upload" type="file" onChange={handleFileChange} className="text-foreground file:text-primary file:font-semibold" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt" />
          {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpload} disabled={!selectedFile}>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload File
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Study Library</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search materials..."
              className="pl-8 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] hidden sm:table-cell"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.length > 0 ? filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="hidden sm:table-cell">
                    <FileType className="h-6 w-6 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{material.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{material.uploadDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(material.id)} aria-label="Delete material">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                    No materials found. Try uploading some!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
