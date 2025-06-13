
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormField from '@/components/ui/FormField';
import { useGlobalStore } from '@/store';
import { toast } from '@/hooks/use-toast';

const settingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required'),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const Settings: React.FC = () => {
  const { addNotification } = useGlobalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: 'Acme Corporation',
      email: 'admin@acme.com',
      timezone: 'UTC-5',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        title: 'Settings Updated',
        message: 'Your settings have been saved successfully.',
        read: false,
      });
      
      toast({
        title: "Success",
        description: "Settings have been updated successfully.",
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update settings. Please try again.',
        read: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application settings and preferences."
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Company Name"
                error={errors.companyName?.message}
                required
              >
                <Input
                  {...register('companyName')}
                  error={!!errors.companyName}
                />
              </FormField>

              <FormField
                label="Email Address"
                error={errors.email?.message}
                required
              >
                <Input
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                />
              </FormField>

              <FormField
                label="Timezone"
                error={errors.timezone?.message}
                required
              >
                <select
                  {...register('timezone')}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC">UTC</option>
                </select>
              </FormField>

              <FormField
                label="Language"
                error={errors.language?.message}
                required
              >
                <select
                  {...register('language')}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </FormField>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  {...register('notifications.email')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Push Notifications</label>
                  <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                </div>
                <input
                  type="checkbox"
                  {...register('notifications.push')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">SMS Notifications</label>
                  <p className="text-sm text-gray-600">Receive notifications via text message</p>
                </div>
                <input
                  type="checkbox"
                  {...register('notifications.sms')}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
