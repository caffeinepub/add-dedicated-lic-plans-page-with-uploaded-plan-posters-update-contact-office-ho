import { useState } from 'react';
import { ArrowLeft, Upload, Loader2, CheckCircle2, AlertCircle, FileImage, ChevronDown, ChevronUp, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGetPlans, useCreateOrUpdatePlan, useIsCallerAdmin } from '../hooks/usePlans';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { processImageForPlan, OCRProgress } from '../utils/ocr';
import { ExternalBlob, PlanMetadata, PlanEntry } from '../backend';
import { buildBestCandidateMapping, derivePlanTitle, normalizePlanTitle } from '../utils/planFilenameMatching';
import { PlanPosterImage } from '../components/plans/PlanPosterImage';

interface PendingUpload {
  file: File;
  derivedTitle: string;
  isSelected: boolean;
}

export default function LICPlans() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: plans, isLoading: plansLoading, error: plansError } = useGetPlans();
  const createOrUpdatePlan = useCreateOrUpdatePlan();

  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState<OCRProgress | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const scrollToContact = () => {
    window.location.hash = '';
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const goHome = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuth = async () => {
    if (identity) {
      await clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate files
    const validFiles: PendingUpload[] = [];
    let hasError = false;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setUploadError(`Invalid file: ${file.name}. Please select only image files.`);
        hasError = true;
        break;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File too large: ${file.name}. Maximum size is 10MB.`);
        hasError = true;
        break;
      }

      const derivedTitle = derivePlanTitle(file.name);
      validFiles.push({
        file,
        derivedTitle,
        isSelected: true,
      });
    }

    if (!hasError) {
      setPendingUploads(prev => [...prev, ...validFiles]);
      setUploadError(null);
      setUploadSuccess(null);
    }

    // Reset file input
    e.target.value = '';
  };

  const clearAllUploads = () => {
    setPendingUploads([]);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const findExistingPlanByTitle = (title: string): PlanEntry | undefined => {
    if (!plans) return undefined;
    
    const normalizedSearchTitle = normalizePlanTitle(title);
    
    return plans.find(p => {
      const normalizedPlanTitle = normalizePlanTitle(p.metadata.title);
      return normalizedPlanTitle === normalizedSearchTitle;
    });
  };

  const handleUploadAll = async () => {
    if (pendingUploads.length === 0 || !identity) return;

    setIsProcessing(true);
    setUploadError(null);
    setUploadSuccess(null);
    setUploadProgress({ status: 'Preparing uploads...', progress: 0 });

    try {
      // Build best-candidate mapping
      const allFiles = pendingUploads.map(u => u.file);
      const bestMapping = buildBestCandidateMapping(allFiles);

      const planTitles = Array.from(bestMapping.keys());
      let completed = 0;
      const createdTitles: string[] = [];
      const updatedTitles: string[] = [];

      for (const planTitle of planTitles) {
        const file = bestMapping.get(planTitle)!;
        
        setUploadProgress({
          status: `Processing ${planTitle} (${completed + 1}/${planTitles.length})...`,
          progress: Math.floor((completed / planTitles.length) * 90),
        });

        // Process image and extract structured content
        const structuredContent = await processImageForPlan(
          file,
          planTitle,
          (progress) => {
            const baseProgress = Math.floor((completed / planTitles.length) * 90);
            const stepProgress = Math.floor(progress.progress * 0.9 / planTitles.length);
            setUploadProgress({
              status: `${planTitle}: ${progress.status}`,
              progress: baseProgress + stepProgress,
            });
          }
        );

        // Convert image to bytes
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        const posterBlob = ExternalBlob.fromBytes(bytes);

        // Check if plan exists (using normalized title comparison)
        const existingPlan = findExistingPlanByTitle(planTitle);
        const now = BigInt(Date.now() * 1000000);

        const metadata: PlanMetadata = {
          title: planTitle,
          description: `${planTitle} - LIC Insurance Plan`,
          creator: existingPlan?.metadata.creator || identity.getPrincipal(),
          createdAt: existingPlan?.metadata.createdAt || now,
          updatedAt: now,
        };

        const planId = existingPlan?.id || `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create or update plan
        await createOrUpdatePlan.mutateAsync({
          id: planId,
          metadata,
          poster: posterBlob,
          structuredContent,
        });

        // Track whether this was a create or update
        if (existingPlan) {
          updatedTitles.push(planTitle);
        } else {
          createdTitles.push(planTitle);
        }

        completed++;
      }

      setUploadProgress(null);
      
      // Build success message
      let successMessage = '';
      if (createdTitles.length > 0) {
        successMessage += `Created: ${createdTitles.join(', ')}`;
      }
      if (updatedTitles.length > 0) {
        if (successMessage) successMessage += '. ';
        successMessage += `Updated: ${updatedTitles.join(', ')}`;
      }
      
      setUploadSuccess(successMessage || `Successfully processed ${planTitles.length} plan(s)`);
      setPendingUploads([]);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress(null);
      
      // Provide actionable error messages
      let errorMessage = 'Failed to upload plans. ';
      
      if (error.message?.includes('Actor not available')) {
        errorMessage += 'Backend connection failed. Please refresh the page and try again.';
      } else if (error.message?.includes('Permission denied') || error.message?.includes('Unauthorized')) {
        errorMessage += 'You do not have permission to create plans. Please contact an administrator.';
      } else if (error.message?.includes('conversion')) {
        errorMessage += 'Image processing failed. Please ensure the file is a valid image.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setUploadError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlanExpansion = (planId: string) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  const renderPlanContent = (plan: PlanEntry) => {
    const content = plan.content;
    const sections = [
      { title: 'Overview', text: content.analysis },
      { title: 'Benefits & Goals', text: content.goals },
      { title: 'Coverage Details', text: content.hypothesis },
      { title: 'Investment Structure', text: content.experiment },
      { title: 'Returns & Outcomes', text: content.result },
    ].filter(section => section.text && section.text.trim().length > 0);
    
    return (
      <div className="space-y-6 pt-6">
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold text-foreground mb-3">{section.title}</h3>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{section.text}</p>
          </div>
        ))}
        {sections.length === 0 && (
          <p className="text-muted-foreground italic">No detailed information available for this plan.</p>
        )}
      </div>
    );
  };

  // Group pending uploads by derived title and show best candidate
  const uploadGroups = new Map<string, PendingUpload[]>();
  for (const upload of pendingUploads) {
    if (!uploadGroups.has(upload.derivedTitle)) {
      uploadGroups.set(upload.derivedTitle, []);
    }
    uploadGroups.get(upload.derivedTitle)!.push(upload);
  }

  const bestCandidates = pendingUploads.length > 0 
    ? buildBestCandidateMapping(pendingUploads.map(u => u.file))
    : new Map<string, File>();

  const isAuthenticated = !!identity;
  const showAdminUpload = isAuthenticated && !isAdminLoading && isAdmin;

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={goHome}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              LIC Insurance Plans
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover comprehensive insurance solutions designed to secure your family's future
              and achieve your life goals with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Admin Login/Upload Section */}
      {isAuthenticated && showAdminUpload && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Plan Images (Admin Only)
                    </CardTitle>
                    <CardDescription>
                      Select multiple plan poster images. The system will automatically match them to plans and use the best image for each.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAuth}
                    disabled={loginStatus === 'logging-in'}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plan-upload">Plan Poster Images</Label>
                  <Input
                    id="plan-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={isProcessing || !!uploadProgress}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported: JPG, PNG, WebP (max 10MB each). Select multiple files at once.
                  </p>
                </div>

                {pendingUploads.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">
                        Pending Uploads ({pendingUploads.length} file{pendingUploads.length > 1 ? 's' : ''})
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllUploads}
                        disabled={isProcessing}
                      >
                        Clear All
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3 bg-muted/30">
                      {Array.from(uploadGroups.entries()).map(([planTitle, uploads]) => {
                        const bestFile = bestCandidates.get(planTitle);
                        const isBestFile = (file: File) => bestFile?.name === file.name;
                        
                        return (
                          <div key={planTitle} className="space-y-1">
                            <div className="font-medium text-sm text-foreground">{planTitle}</div>
                            {uploads.map((upload, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center gap-2 text-xs pl-4 py-1 rounded ${
                                  isBestFile(upload.file)
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                <FileImage className="h-3 w-3" />
                                <span className="flex-1 truncate">{upload.file.name}</span>
                                {isBestFile(upload.file) && (
                                  <Badge variant="secondary" className="text-xs">Selected</Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>

                    <Button
                      onClick={handleUploadAll}
                      disabled={isProcessing || !!uploadProgress}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload & Process ({Array.from(bestCandidates.keys()).length} plan{Array.from(bestCandidates.keys()).length > 1 ? 's' : ''})
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {uploadProgress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{uploadProgress.status}</span>
                      <span className="font-medium">{uploadProgress.progress}%</span>
                    </div>
                    <Progress value={uploadProgress.progress} className="h-2" />
                  </div>
                )}

                {uploadError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}

                {uploadSuccess && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">{uploadSuccess}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Login Prompt for Non-Admin Users */}
      {!isAuthenticated && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <CardTitle>Admin Access Required</CardTitle>
                <CardDescription>
                  Log in to upload and manage LIC plan images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleAuth}
                  disabled={loginStatus === 'logging-in'}
                  size="lg"
                >
                  {loginStatus === 'logging-in' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Plans Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : plansError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load plans. Please refresh the page or contact support.
              </AlertDescription>
            </Alert>
          ) : !plans || plans.length === 0 ? (
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <CardTitle>No Plans Available</CardTitle>
                <CardDescription>
                  Check back soon for comprehensive LIC insurance plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={scrollToContact} variant="outline">
                  Contact Us for Information
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isExpanded = expandedPlanId === plan.id;
                
                return (
                  <Card
                    key={plan.id}
                    className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      isExpanded ? 'md:col-span-2 lg:col-span-3' : ''
                    }`}
                  >
                    <div className={isExpanded ? 'grid md:grid-cols-2 gap-6' : ''}>
                      {/* Poster Image */}
                      <div className={isExpanded ? 'md:sticky md:top-24 md:self-start' : ''}>
                        <PlanPosterImage
                          poster={plan.poster}
                          planTitle={plan.metadata.title}
                          className="w-full h-auto object-cover rounded-t-lg"
                          fallbackClassName={isExpanded ? 'h-96' : 'h-48'}
                        />
                      </div>

                      {/* Content */}
                      <div className={isExpanded ? 'p-6' : ''}>
                        <CardHeader>
                          <CardTitle className="text-2xl">{plan.metadata.title}</CardTitle>
                          <CardDescription>{plan.metadata.description}</CardDescription>
                        </CardHeader>
                        
                        {isExpanded && (
                          <CardContent>
                            {renderPlanContent(plan)}
                          </CardContent>
                        )}
                        
                        <CardContent className={isExpanded ? 'pt-6' : ''}>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => togglePlanExpansion(plan.id)}
                              variant={isExpanded ? 'outline' : 'default'}
                              className="flex-1"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="mr-2 h-4 w-4" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="mr-2 h-4 w-4" />
                                  View Details
                                </>
                              )}
                            </Button>
                            <Button onClick={scrollToContact} variant="secondary">
                              Get Quote
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
