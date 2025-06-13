
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '@/components/common/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FormField from '@/components/ui/FormField';
import { useGlobalStore } from '@/store';
import { Camera, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { user, addNotification } = useGlobalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: user?.email || 'john@example.com',
      phone: '+1 (555) 123-4567',
      bio: 'Full-stack developer with a passion for creating amazing user experiences.',
      website: 'https://johndoe.dev',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.',
        read: false,
      });
      
      toast({
        title: "Success",
        description: "Profile has been updated successfully.",
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update profile. Please try again.',
        read: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and account settings."
      />

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-gray-600" />
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors duration-200">
              <Camera className="h-3 w-3" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
            <p className="text-gray-600">{user?.email || 'john@example.com'}</p>
            <p className="text-sm text-gray-500 mt-1">Administrator</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'security'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Security
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="First Name"
                  error={errors.firstName?.message}
                  required
                >
                  <Input
                    {...register('firstName')}
                    error={!!errors.firstName}
                  />
                </FormField>

                <FormField
                  label="Last Name"
                  error={errors.lastName?.message}
                  required
                >
                  <Input
                    {...register('lastName')}
                    error={!!errors.lastName}
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
                  label="Phone Number"
                  error={errors.phone?.message}
                >
                  <Input
                    {...register('phone')}
                    error={!!errors.phone}
                  />
                </FormField>
              </div>

              <FormField
                label="Website"
                error={errors.website?.message}
              >
                <Input
                  type="url"
                  {...register('website')}
                  error={!!errors.website}
                  placeholder="https://your-website.com"
                />
              </FormField>

              <FormField
                label="Bio"
                error={errors.bio?.message}
              >
                <textarea
                  {...register('bio')}
                  rows={4}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </FormField>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <FormField
                label="Current Password"
                error={errors.currentPassword?.message}
              >
                <Input
                  type="password"
                  {...register('currentPassword')}
                  error={!!errors.currentPassword}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="New Password"
                  error={errors.newPassword?.message}
                >
                  <Input
                    type="password"
                    {...register('newPassword')}
                    error={!!errors.newPassword}
                  />
                </FormField>

                <FormField
                  label="Confirm New Password"
                  error={errors.confirmPassword?.message}
                >
                  <Input
                    type="password"
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                  />
                </FormField>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800">Password Requirements:</h4>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-6 mt-6 flex justify-end space-x-3">
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

export default Profile;
