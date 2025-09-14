import React from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminSecurityAlert } from '@/components/AdminSecurityAlert';

const UserManagement = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users-secure'],
    queryFn: async () => {
      // Use the secure database function that excludes sensitive fields
      const { data, error } = await supabase.rpc('get_admin_safe_profiles');
      
      if (error) {
        // Log security event for failed access attempt
        await supabase
          .from('security_audit_log')
          .insert({
            user_id: null,
            action: 'admin_profile_access_failed',
            table_name: 'profiles',
            attempted_columns: ['all_fields'],
            success: false,
            blocked_reason: error.message
          });
        throw error;
      }
      
      // Log successful admin access
      await supabase
        .from('security_audit_log')
        .insert({
          action: 'admin_safe_profile_access',
          table_name: 'profiles',
          attempted_columns: ['non_sensitive_fields_only'],
          success: true
        });
      
      return data;
    },
  });

  const { data: userRoles } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sl-SI');
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Admin
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <AdminSecurityAlert />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>System Users ({users?.length || 0})</CardTitle>
              <CardDescription>
                Manage user accounts and roles. Phone numbers are protected and not visible for privacy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Display Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Skill Level</TableHead>
                      <TableHead>General Location</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {user.display_name || 'Unknown User'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {userRoles?.filter(role => role.user_id === user.user_id).length ? (
                            <div className="flex gap-1">
                              {userRoles
                                ?.filter(role => role.user_id === user.user_id)
                                .map((roleEntry, index) => (
                                <Badge 
                                  key={index} 
                                  variant={roleEntry.role === 'admin' ? 'default' : 'secondary'}
                                >
                                  {roleEntry.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                                  {roleEntry.role}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <Badge variant="outline">user</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.skill_level ? (
                            <Badge variant="outline">{user.skill_level}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.location || <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" disabled>
                            Edit Role
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Role assignment and management features coming soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Full role management functionality will be available once admin policies are properly configured.
                Currently, roles can only be assigned directly through the database.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminRoute>
  );
};

export default UserManagement;