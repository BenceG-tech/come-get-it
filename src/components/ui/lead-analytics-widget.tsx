import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Star, 
  Filter,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react';
import analytics from '@/lib/analytics';

interface LeadData {
  id: string;
  score: number;
  quality: 'hot' | 'warm' | 'cold';
  category: 'consumer' | 'business_partner' | 'venue_owner';
  source: string;
  timestamp: number;
  email: string;
  formData?: any;
}

interface LeadAnalyticsWidgetProps {
  className?: string;
  showDetailed?: boolean;
}

export const LeadAnalyticsWidget: React.FC<LeadAnalyticsWidgetProps> = ({ 
  className,
  showDetailed = false 
}) => {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data - in real app, this would come from analytics/database
  useEffect(() => {
    const mockLeads: LeadData[] = [
      {
        id: 'lead_1',
        score: 85,
        quality: 'hot',
        category: 'venue_owner',
        source: 'qualified_signup_venue',
        timestamp: Date.now() - 3600000,
        email: 'restaurant@example.com'
      },
      {
        id: 'lead_2',
        score: 45,
        quality: 'warm',
        category: 'business_partner',
        source: 'qualified_signup_business',
        timestamp: Date.now() - 7200000,
        email: 'partner@example.com'
      },
      {
        id: 'lead_3',
        score: 15,
        quality: 'cold',
        category: 'consumer',
        source: 'basic_signup',
        timestamp: Date.now() - 86400000,
        email: 'user@example.com'
      }
    ];
    setLeads(mockLeads);
  }, []);

  const filteredLeads = leads.filter(lead => 
    selectedCategory === 'all' || lead.category === selectedCategory
  );

  const leadStats = {
    total: filteredLeads.length,
    hot: filteredLeads.filter(l => l.quality === 'hot').length,
    warm: filteredLeads.filter(l => l.quality === 'warm').length,
    cold: filteredLeads.filter(l => l.quality === 'cold').length,
    averageScore: filteredLeads.reduce((sum, l) => sum + l.score, 0) / filteredLeads.length || 0
  };

  const conversionRate = leadStats.total > 0 ? (leadStats.hot / leadStats.total) * 100 : 0;

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Score', 'Quality', 'Category', 'Source', 'Email', 'Date'],
      ...filteredLeads.map(lead => [
        lead.id,
        lead.score.toString(),
        lead.quality,
        lead.category,
        lead.source,
        lead.email,
        new Date(lead.timestamp).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    analytics.track('lead_analytics_export', { 
      timeframe, 
      category: selectedCategory,
      lead_count: filteredLeads.length 
    });
  };

  if (!showDetailed) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Lead Quality Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <Badge variant={conversionRate > 20 ? 'default' : conversionRate > 10 ? 'secondary' : 'outline'}>
                {conversionRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={conversionRate} className="h-2" />
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-red-500">{leadStats.hot}</div>
                <div className="text-xs text-muted-foreground">Hot</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-500">{leadStats.warm}</div>
                <div className="text-xs text-muted-foreground">Warm</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-500">{leadStats.cold}</div>
                <div className="text-xs text-muted-foreground">Cold</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Lead Analytics Dashboard
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="day">Last 24 hours</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
          </select>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="all">All Categories</option>
            <option value="consumer">Consumers</option>
            <option value="business_partner">Business Partners</option>
            <option value="venue_owner">Venue Owners</option>
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold">{leadStats.total}</p>
                      <p className="text-xs text-muted-foreground">Total Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold">{leadStats.averageScore.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Conversion</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold">{leadStats.hot}</p>
                      <p className="text-xs text-muted-foreground">Hot Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="quality" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Hot Leads</span>
                  <span className="text-sm text-muted-foreground">{leadStats.hot} leads</span>
                </div>
                <Progress value={(leadStats.hot / leadStats.total) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Warm Leads</span>
                  <span className="text-sm text-muted-foreground">{leadStats.warm} leads</span>
                </div>
                <Progress value={(leadStats.warm / leadStats.total) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Cold Leads</span>
                  <span className="text-sm text-muted-foreground">{leadStats.cold} leads</span>
                </div>
                <Progress value={(leadStats.cold / leadStats.total) * 100} className="h-2" />
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Recent High-Quality Leads</h4>
              <div className="space-y-2">
                {filteredLeads
                  .filter(lead => lead.quality === 'hot')
                  .slice(0, 3)
                  .map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{lead.email}</p>
                        <p className="text-xs text-muted-foreground">{lead.category.replace('_', ' ')}</p>
                      </div>
                      <Badge variant="default">
                        Score: {lead.score}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="space-y-4">
            <div className="space-y-3">
              {Array.from(new Set(filteredLeads.map(l => l.source))).map(source => {
                const sourceLeads = filteredLeads.filter(l => l.source === source);
                const percentage = (sourceLeads.length / filteredLeads.length) * 100;
                
                return (
                  <div key={source} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium capitalize">
                        {source.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {sourceLeads.length} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};