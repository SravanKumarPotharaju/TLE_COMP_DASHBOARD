import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface FileUploadSectionProps {
  currentFile: File | null;
  referenceFile: File | null;
  onCurrentFileChange: (file: File | null) => void;
  onReferenceFileChange: (file: File | null) => void;
  onLoad: () => void;
  loading: boolean;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  currentFile,
  referenceFile,
  onCurrentFileChange,
  onReferenceFileChange,
  onLoad,
  loading
}) => {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          TLE File Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="current-file">Current TLE File</Label>
            <Input
              id="current-file"
              type="file"
              accept=".txt,.tle"
              onChange={(e) => handleFileChange(e, onCurrentFileChange)}
              className="cursor-pointer"
            />
            {currentFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {currentFile.name}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reference-file">Reference TLE File</Label>
            <Input
              id="reference-file"
              type="file"
              accept=".txt,.tle"
              onChange={(e) => handleFileChange(e, onReferenceFileChange)}
              className="cursor-pointer"
            />
            {referenceFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {referenceFile.name}
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={onLoad} 
          disabled={!currentFile || !referenceFile || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Files...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Load and Compare TLE Files
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};