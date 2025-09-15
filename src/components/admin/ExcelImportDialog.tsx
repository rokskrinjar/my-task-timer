import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { useExcelImport } from '@/hooks/useExcelImport';
import { useToast } from '@/hooks/use-toast';

interface ExcelImportDialogProps {
  onImportComplete: () => void;
}

export const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({ onImportComplete }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { downloadTemplate, processFile, isProcessing } = useExcelImport();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                     file.type === 'application/vnd.ms-excel';
      
      if (!isExcel) {
        toast({
          title: "Invalid file type",
          description: "Please select an Excel file (.xlsx or .xls)",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    const result = await processFile(selectedFile);
    
    if (result.success) {
      toast({
        title: "Import successful",
        description: result.message
      });
      onImportComplete();
      setOpen(false);
      setSelectedFile(null);
    } else {
      toast({
        title: "Import failed",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Import Questions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Questions from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file with questions to import them in bulk
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Template Download</CardTitle>
              <CardDescription className="text-xs">
                Download the Excel template with proper format and sample data
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Required Columns</CardTitle>
              <CardDescription className="text-xs">
                Your Excel file must contain these exact column headers:
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs space-y-1 text-muted-foreground">
                <div>• <span className="font-mono">question_text</span> - The question</div>
                <div>• <span className="font-mono">grade_level</span> - Number 1-12</div>
                <div>• <span className="font-mono">subject</span> - Subject name</div>
                <div>• <span className="font-mono">option_a, option_b, option_c, option_d</span> - Answer options</div>
                <div>• <span className="font-mono">correct_answer</span> - A, B, C, or D</div>
                <div>• <span className="font-mono">difficulty_order</span> - Number 1-5</div>
                <div>• <span className="font-mono">category</span> - Question category</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Excel File</label>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={isProcessing}
            />
            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Questions
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};