
import React, { useEffect } from 'react';
import { useApiCall } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import { 
  Users, 
  DollarSign, 
  FolderOpen, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '@/utils';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useApiCall(
    ['dashboard-stats'],
    apiService.dashboard.getStats
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your projects today."
        action={{
          label: 'New Project',
          onClick: () => console.log('Create new project'),
        }}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.data.totalUsers.toLocaleString() || '0'}
          change={{ value: 12, type: 'increase' }}
          icon={Users}
          color="blue"
        />
        
        <StatsCard
          title="Revenue"
          value={formatCurrency(stats?.data.totalRevenue || 0)}
          change={{ value: 8, type: 'increase' }}
          icon={DollarSign}
          color="green"
        />
        
        <StatsCard
          title="Active Projects"
          value={stats?.data.activeProjects || 0}
          change={{ value: 5, type: 'decrease' }}
          icon={FolderOpen}
          color="yellow"
        />
        
        <StatsCard
          title="Conversion Rate"
          value={`${stats?.data.conversionRate || 0}%`}
          change={{ value: 2, type: 'increase' }}
          icon={TrendingUp}
          color="red"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {[
              { name: 'Website Redesign', progress: 75, status: 'On Track' },
              { name: 'Mobile App', progress: 45, status: 'In Progress' },
              { name: 'API Integration', progress: 90, status: 'Almost Done' },
            ].map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600">{project.status}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{project.progress}%</div>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { 
                title: 'Create New Project', 
                description: 'Start a new project from scratch',
                icon: FolderOpen 
              },
              { 
                title: 'Invite Team Member', 
                description: 'Add someone to your workspace',
                icon: Users 
              },
              { 
                title: 'View Analytics', 
                description: 'Check your performance metrics',
                icon: TrendingUp 
              },
            ].map((action, index) => (
              <button
                key={index}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="flex items-center">
                  <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                    <action.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto group-hover:text-gray-600 transition-colors duration-200" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
