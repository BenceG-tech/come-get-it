import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import analytics from '@/lib/analytics';
import { supabase } from '@/lib/supabase';
import { ArrowRight, CheckCircle, Star, Building2, Calendar, DollarSign } from 'lucide-react';

interface QualifiedSignupFormProps {
  variant?: 'basic' | 'business' | 'venue';
  onComplete?: (leadData: any) => void;
}

export const QualifiedSignupForm: React.FC<QualifiedSignupFormProps> = ({ 
  variant = 'basic',
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [leadScore, setLeadScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Basic Info
    email: '',
    name: '',
    phone: '',
    
    // Qualification Questions
    interest_level: '',
    timeline: '',
    business_type: '',
    business_size: '',
    current_challenges: '',
    budget_range: '',
    
    // Advanced Fields
    company: '',
    position: '',
    venue_details: '',
    goals: '',
    
    // Consent
    gdpr_consent: false,
    marketing_consent: false
  });

  const totalSteps = variant === 'basic' ? 2 : variant === 'business' ? 3 : 4;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    analytics.leadScoring.pageView(`qualified_signup_${variant}`);
  }, [variant]);

  const calculateLeadScore = (data: typeof formData) => {
    let score = 0;
    
    // Interest level scoring
    if (data.interest_level === 'immediate') score += 20;
    else if (data.interest_level === 'next_month') score += 15;
    else if (data.interest_level === 'next_quarter') score += 10;
    
    // Timeline scoring
    if (data.timeline === 'asap') score += 15;
    else if (data.timeline === '1_month') score += 10;
    else if (data.timeline === '3_months') score += 5;
    
    // Business type scoring
    if (data.business_type === 'restaurant' || data.business_type === 'bar') score += 25;
    else if (data.business_type === 'retail') score += 15;
    
    // Business size scoring
    if (data.business_size === 'enterprise') score += 20;
    else if (data.business_size === 'medium') score += 15;
    else if (data.business_size === 'small') score += 10;
    
    return score;
  };

  const getLeadQuality = (score: number): 'hot' | 'warm' | 'cold' => {
    if (score >= 50) return 'hot';
    if (score >= 25) return 'warm';
    return 'cold';
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Real-time lead scoring
    const newScore = calculateLeadScore(newFormData);
    setLeadScore(newScore);
    
    analytics.leadScoring.formInteraction(`qualified_signup_${variant}`, Object.keys(newFormData).filter(key => newFormData[key as keyof typeof newFormData]).length);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.gdpr_consent) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields and accept the privacy policy.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const finalScore = calculateLeadScore(formData);
      const leadQuality = getLeadQuality(finalScore);
      
      // Track lead qualification
      analytics.leadScoring.qualificationQuestion('overall_qualification', leadQuality, leadQuality);
      analytics.leadScoring.businessProfile(formData.business_type, formData.business_size, formData.timeline, formData.budget_range);
      
      const leadCategory = variant === 'venue' ? 'venue_owner' : variant === 'business' ? 'business_partner' : 'consumer';
      const priority = leadQuality === 'hot' ? 'high' : leadQuality === 'warm' ? 'medium' : 'low';
      analytics.leadScoring.leadCategory(leadCategory, priority);

      // Enhanced email data for Supabase function
      const emailData = {
        type: 'qualified_lead',
        email: formData.email,
        name: formData.name,
        formData: {
          ...formData,
          lead_score: finalScore,
          lead_quality: leadQuality,
          lead_category: leadCategory,
          submission_timestamp: new Date().toISOString()
        }
      };

      if (supabase) {
        const { error } = await supabase.functions.invoke('send-notification-email', {
          body: emailData
        });

        if (error) throw error;
      }

      analytics.leadSource.conversion(`lead_${Date.now()}`, 'qualified_signup', finalScore);
      
      setIsSubmitted(true);
      onComplete?.(emailData.formData);
      
      toast({
        title: "Application submitted successfully!",
        description: `Thank you! We'll be in touch soon. Your qualification score: ${finalScore}`,
      });

    } catch (error) {
      console.error('Error submitting qualified signup:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    const leadQuality = getLeadQuality(leadScore);
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-4">
            Your qualification has been submitted successfully.
          </p>
          <Badge variant={leadQuality === 'hot' ? 'default' : leadQuality === 'warm' ? 'secondary' : 'outline'} className="mb-4">
            <Star className="h-3 w-3 mr-1" />
            {leadQuality.toUpperCase()} Lead (Score: {leadScore})
          </Badge>
          <p className="text-sm text-muted-foreground">
            {leadQuality === 'hot' && "We'll contact you within 24 hours!"}
            {leadQuality === 'warm' && "We'll be in touch within 2-3 business days."}
            {leadQuality === 'cold' && "We'll send you relevant updates and resources."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {variant === 'basic' && 'Join Our Community'}
            {variant === 'business' && 'Partner Application'}
            {variant === 'venue' && 'Venue Owner Registration'}
          </span>
          <Badge variant="outline">
            Score: {leadScore}
          </Badge>
        </CardTitle>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {variant !== 'basic' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Company/Venue Name</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Your Position/Role</Label>
                    <Input
                      id="position"
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="e.g., Owner, Manager, Marketing Director"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Qualification Questions */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Tell Us About Your Interest
              </h3>
              
              <div>
                <Label>How would you describe your current interest level?</Label>
                <RadioGroup 
                  value={formData.interest_level} 
                  onValueChange={(value) => handleInputChange('interest_level', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediate" id="immediate" />
                    <Label htmlFor="immediate">Ready to get started immediately</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="next_month" id="next_month" />
                    <Label htmlFor="next_month">Planning to start within next month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="next_quarter" id="next_quarter" />
                    <Label htmlFor="next_quarter">Exploring options for next quarter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="future" id="future" />
                    <Label htmlFor="future">Future consideration</Label>
                  </div>
                </RadioGroup>
              </div>

              {variant !== 'basic' && (
                <>
                  <div>
                    <Label>What type of business do you operate?</Label>
                    <RadioGroup 
                      value={formData.business_type} 
                      onValueChange={(value) => handleInputChange('business_type', value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="restaurant" id="restaurant" />
                        <Label htmlFor="restaurant">Restaurant</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bar" id="bar" />
                        <Label htmlFor="bar">Bar/Pub</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cafe" id="cafe" />
                        <Label htmlFor="cafe">Café</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="retail" id="retail" />
                        <Label htmlFor="retail">Retail Store</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Business size</Label>
                    <RadioGroup 
                      value={formData.business_size} 
                      onValueChange={(value) => handleInputChange('business_size', value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="single" id="single" />
                        <Label htmlFor="single">Single location</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="small" id="small" />
                        <Label htmlFor="small">2-5 locations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">6-20 locations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enterprise" id="enterprise" />
                        <Label htmlFor="enterprise">20+ locations</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Business Details (Business/Venue only) */}
          {currentStep === 3 && variant !== 'basic' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Project Details
              </h3>
              
              <div>
                <Label>What's your timeline for implementation?</Label>
                <RadioGroup 
                  value={formData.timeline} 
                  onValueChange={(value) => handleInputChange('timeline', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asap" id="asap" />
                    <Label htmlFor="asap">As soon as possible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1_month" id="1_month" />
                    <Label htmlFor="1_month">Within 1 month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3_months" id="3_months" />
                    <Label htmlFor="3_months">Within 3 months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6_months" id="6_months" />
                    <Label htmlFor="6_months">Within 6 months</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="current_challenges">What are your current challenges? (Optional)</Label>
                <Textarea
                  id="current_challenges"
                  value={formData.current_challenges}
                  onChange={(e) => handleInputChange('current_challenges', e.target.value)}
                  placeholder="Tell us about any challenges you're facing that we might help solve..."
                  rows={3}
                />
              </div>

              {variant === 'business' && (
                <div>
                  <Label>What's your approximate budget range?</Label>
                  <RadioGroup 
                    value={formData.budget_range} 
                    onValueChange={(value) => handleInputChange('budget_range', value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="under_1k" id="under_1k" />
                      <Label htmlFor="under_1k">Under $1,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1k_5k" id="1k_5k" />
                      <Label htmlFor="1k_5k">$1,000 - $5,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5k_10k" id="5k_10k" />
                      <Label htmlFor="5k_10k">$5,000 - $10,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10k_plus" id="10k_plus" />
                      <Label htmlFor="10k_plus">$10,000+</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Goals & Additional Info (Venue only) */}
          {currentStep === 4 && variant === 'venue' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Goals & Expectations
              </h3>
              
              <div>
                <Label htmlFor="venue_details">Tell us more about your venue</Label>
                <Textarea
                  id="venue_details"
                  value={formData.venue_details}
                  onChange={(e) => handleInputChange('venue_details', e.target.value)}
                  placeholder="Location, capacity, type of customers, unique features..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="goals">What are your main goals with our platform?</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="Increase revenue, improve customer engagement, streamline operations..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Consent Section (Last step) */}
          {currentStep === totalSteps && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="gdpr_consent"
                  checked={formData.gdpr_consent}
                  onCheckedChange={(checked) => handleInputChange('gdpr_consent', checked)}
                />
                <Label htmlFor="gdpr_consent" className="text-sm">
                  I agree to the privacy policy and terms of service *
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketing_consent"
                  checked={formData.marketing_consent}
                  onCheckedChange={(checked) => handleInputChange('marketing_consent', checked)}
                />
                <Label htmlFor="marketing_consent" className="text-sm">
                  I would like to receive marketing updates and newsletters
                </Label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button 
                type="button" 
                onClick={handleNext}
                className="ml-auto"
                disabled={currentStep === 1 && (!formData.name || !formData.email)}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="ml-auto"
                disabled={isLoading || !formData.gdpr_consent}
              >
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};