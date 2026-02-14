import { useState } from 'react';
import { ArrowLeft, Upload, Loader2, CheckCircle2, AlertCircle, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useGetPlans, useCreateOrUpdatePlan, useIsCallerAdmin } from '../hooks/usePlans';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { processImageForPlan, OCRProgress } from '../utils/ocr';
import { ExternalBlob, PlanMetadata, PlanEntry } from '../backend';
import { buildBestCandidateMapping, derivePlanTitle } from '../utils/planFilenameMatching';

interface PendingUpload {
  file: File;
  derivedTitle: string;
  isSelected: boolean;
}

export default function LICPlans() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: plans, isLoading: plansLoading, error: plansError } = useGetPlans();
  const createOrUpdatePlan = useCreateOrUpdatePlan();

  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState<OCRProgress | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const removeUpload = (index: number) => {
    setPendingUploads(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllUploads = () => {
    setPendingUploads([]);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const findExistingPlanByTitle = (title: string): PlanEntry | undefined => {
    return plans?.find(p => p.metadata.title === title);
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

        // Check if plan exists
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

        completed++;
      }

      setUploadProgress(null);
      setUploadSuccess(
        `Successfully processed ${planTitles.length} plan${planTitles.length > 1 ? 's' : ''}: ${planTitles.join(', ')}`
      );
      setPendingUploads([]);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress(null);
      
      // Provide actionable error messages
      let errorMessage = 'Failed to upload plans. ';
      
      if (error.message?.includes('Actor not available')) {
        errorMessage += 'Backend connection failed. Please refresh the page and try again.';
      } else if (error.message?.includes('Permission denied')) {
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

  const renderPlanContent = (plan: PlanEntry) => {
    const content = plan.content;
    
    return (
      <div className="space-y-6">
        {content.analysis && (
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Plan Overview</h3>
            <p className="text-muted-foreground whitespace-pre-line">{content.analysis}</p>
          </div>
        )}

        {content.goals && (
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Benefits & Goals</h3>
            <p className="text-muted-foreground whitespace-pre-line">{content.goals}</p>
          </div>
        )}

        {content.hypothesis && (
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Coverage Details</h3>
            <p className="text-muted-foreground whitespace-pre-line">{content.hypothesis}</p>
          </div>
        )}

        {content.experiment && (
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Investment Structure</h3>
            <p className="text-muted-foreground whitespace-pre-line">{content.experiment}</p>
          </div>
        )}

        {content.result && (
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Returns & Outcomes</h3>
            <p className="text-muted-foreground whitespace-pre-line">{content.result}</p>
          </div>
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

      {/* Admin Upload Section */}
      {!isAdminLoading && isAdmin && identity && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Plan Images (Admin Only)
                </CardTitle>
                <CardDescription>
                  Select multiple plan poster images. The system will automatically match them to plans and use the best image for each.
                </CardDescription>
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

                    <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3 bg-muted/50">
                      {Array.from(uploadGroups.entries()).map(([planTitle, uploads]) => {
                        const bestFile = bestCandidates.get(planTitle);
                        const existingPlan = findExistingPlanByTitle(planTitle);
                        
                        return (
                          <div key={planTitle} className="p-3 bg-background rounded border">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <FileImage className="h-4 w-4 text-primary" />
                                  <span className="font-medium text-sm">{planTitle}</span>
                                  {existingPlan && (
                                    <Badge variant="outline" className="text-xs">
                                      Will Update
                                    </Badge>
                                  )}
                                </div>
                                {uploads.length > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    {uploads.length} files → Using: {bestFile?.name}
                                  </p>
                                )}
                                {uploads.length === 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    {uploads[0].file.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      {uploadSuccess}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleUploadAll}
                  disabled={pendingUploads.length === 0 || isProcessing || !!uploadProgress}
                  className="w-full"
                >
                  {isProcessing || uploadProgress ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Process {uploadGroups.size} Plan{uploadGroups.size > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Plans Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16 max-w-6xl mx-auto">
            {plansLoading ? (
              // Loading skeletons
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden border-2">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-14 w-14 rounded-xl" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-8 w-64" />
                          <Skeleton className="h-4 w-96" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <Skeleton className="h-6 w-48" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-64 w-full rounded-lg" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : plansError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load plans. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            ) : plans && plans.length > 0 ? (
              // Dynamic plans from backend
              plans.map((plan) => (
                <Card
                  key={plan.id}
                  className="overflow-hidden border-2 hover:border-primary/50 transition-colors"
                >
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary rounded-xl">
                        <Upload className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl mb-2">{plan.metadata.title}</CardTitle>
                        <CardDescription className="text-base">
                          {plan.metadata.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        {renderPlanContent(plan)}
                        <div className="pt-4">
                          <Button
                            onClick={scrollToContact}
                            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
                          >
                            Get Plan Details
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <img
                          src={plan.poster.getDirectURL()}
                          alt={`${plan.metadata.title} insurance plan poster`}
                          className="rounded-lg shadow-lg max-w-full h-auto"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert>
                <AlertDescription>
                  No plans available yet. Check back soon for new insurance plans!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
