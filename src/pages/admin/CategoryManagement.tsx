import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminRoute } from '@/components/AdminRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PillToggle } from "@/components/ui/pill-toggle";

interface Category {
  id: string;
  name: string;
  display_name: string;
  is_enabled: boolean;
  question_count: number;
  created_at: string;
  updated_at: string;
}

const CategoryManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [sortColumn, setSortColumn] = useState<'name' | 'question_count' | 'status' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: name.trim(),
          display_name: name.trim(),
          is_enabled: false, // Start disabled until questions are added
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setNewCategoryName('');
      toast({
        title: "Kategorija ustvarjena",
        description: "Nova kategorija je bila uspešno ustvarjena.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Napaka",
        description: error.message || "Napaka pri ustvarjanju kategorije",
        variant: "destructive",
      });
    },
  });

  // Toggle category enabled status
  const toggleCategoryMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('categories')
        .update({ is_enabled: isEnabled })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({
        title: "Kategorija posodobljena",
        description: "Status kategorije je bil uspešno posodobljen.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Napaka",
        description: error.message || "Napaka pri posodabljanju kategorije",
        variant: "destructive",
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({
        title: "Kategorija izbrisana",
        description: "Kategorija je bila uspešno izbrisana.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Napaka",
        description: error.message || "Napaka pri brisanju kategorije",
        variant: "destructive",
      });
    },
  });

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    
    // Check if category already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      toast({
        title: "Napaka",
        description: "Kategorija s tem imenom že obstaja",
        variant: "destructive",
      });
      return;
    }

    createCategoryMutation.mutate(newCategoryName);
  };

  const handleToggleEnabled = (category: Category) => {
    if (!category.is_enabled && category.question_count === 0) {
      toast({
        title: "Napaka",
        description: "Kategorija mora imeti vsaj eno vprašanje, preden jo lahko omogočite",
        variant: "destructive",
      });
      return;
    }
    
    toggleCategoryMutation.mutate({
      id: category.id,
      isEnabled: !category.is_enabled,
    });
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.question_count > 0) {
      toast({
        title: "Napaka",
        description: "Ne morete izbrisati kategorije, ki ima vprašanja",
        variant: "destructive",
      });
      return;
    }
    
    deleteCategoryMutation.mutate(category.id);
  };

  const handleSort = (column: 'name' | 'question_count' | 'status') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: 'name' | 'question_count' | 'status') => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const sortedCategories = React.useMemo(() => {
    if (!sortColumn) return categories;
    
    return [...categories].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortColumn) {
        case 'name':
          aValue = a.display_name.toLowerCase();
          bValue = b.display_name.toLowerCase();
          break;
        case 'question_count':
          aValue = a.question_count;
          bValue = b.question_count;
          break;
        case 'status':
          aValue = a.is_enabled ? 1 : 0;
          bValue = b.is_enabled ? 1 : 0;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [categories, sortColumn, sortDirection]);

  return (
    <AdminRoute>
      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/admin')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Nazaj na nadzorno ploščo
            </Button>
            <h1 className="text-3xl font-bold">Upravljanje kategorij</h1>
          </div>
        </div>

        {/* Add Category Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Dodaj novo kategorijo
            </CardTitle>
            <CardDescription>
              Ustvarite novo kategorijo vprašanj
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Ime kategorije"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                className="flex-1"
              />
              <Button 
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending ? 'Dodajam...' : 'Dodaj kategorijo'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Obstoječe kategorije</CardTitle>
            <CardDescription>
              Upravljajte kategorije vprašanj in njihov status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Nalagam kategorije...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Ni najdenih kategorij
              </div>
            ) : (
                <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead 
                       className="cursor-pointer hover:bg-muted/50 select-none"
                       onClick={() => handleSort('name')}
                     >
                       <div className="flex items-center gap-2">
                         Ime
                         {getSortIcon('name')}
                       </div>
                     </TableHead>
                     <TableHead 
                       className="cursor-pointer hover:bg-muted/50 select-none"
                       onClick={() => handleSort('question_count')}
                     >
                       <div className="flex items-center gap-2">
                         Število vprašanj
                         {getSortIcon('question_count')}
                       </div>
                     </TableHead>
                     <TableHead 
                       className="cursor-pointer hover:bg-muted/50 select-none"
                       onClick={() => handleSort('status')}
                     >
                       <div className="flex items-center gap-2">
                         Status
                         {getSortIcon('status')}
                       </div>
                     </TableHead>
                     <TableHead>Ustvarjeno</TableHead>
                     <TableHead>Dejanja</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {sortedCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.display_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {category.question_count}
                        </Badge>
                      </TableCell>
                       <TableCell>
                          <PillToggle 
                            checked={category.is_enabled}
                            onCheckedChange={() => handleToggleEnabled(category)}
                            disabled={toggleCategoryMutation.isPending}
                          />
                       </TableCell>
                      <TableCell>
                        {new Date(category.created_at).toLocaleDateString('sl-SI')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={category.question_count > 0}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Izbriši kategorijo</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Ali ste prepričani, da želite izbrisati kategorijo "{category.display_name}"? 
                                  Ta dejanja ni mogoče razveljaviti.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Prekliči</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Izbriši
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminRoute>
  );
};

export default CategoryManagement;