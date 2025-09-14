import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Eye } from 'lucide-react';

export const AdminSecurityAlert: React.FC = () => {
  return (
    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-800 dark:text-blue-200">
        Privacy Protection Active
      </AlertTitle>
      <AlertDescription className="text-blue-700 dark:text-blue-300">
        <div className="flex items-start gap-2 mt-2">
          <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            Phone numbers and other sensitive personal data are hidden from admin view for privacy protection. 
            All admin access to user data is logged for security audit purposes.
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};