import { useState } from 'react';
import { ArrowLeft, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPlans, useCreatePlan, useIsCallerAdmin } from '../hooks/usePlans';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { processImageForPlan, OCRProgress } from '../utils/ocr';
import { ExternalBlob, PlanMetadata } from '../backend';

export default function LICPlans() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: plans, isLoading: plansLoading, error: plansError } = useGetPlans();
  const createPlan = useCreatePlan();

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<OCRProgress | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

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
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Image size must be less than 10MB');
        return;
      }
      setUploadFile(file);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const getPlanNameFromFile = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('jivan utsav') || lowerName.includes('jeevan utsav')) {
      return 'Jeevan Utsav';
    }
    if (lowerName.includes('jivan umang') || lowerName.includes('jeevan umang')) {
      return 'Jeevan Umang';
    }
    // Default: capitalize first letters
    return fileName
      .replace(/\.[^/.]+$/, '')
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleUpload = async () => {
    if (!uploadFile || !identity) return;

    setUploadError(null);
    setUploadSuccess(null);
    setUploadProgress({ status: 'Starting processing...', progress: 0 });

    try {
      const planTitle = getPlanNameFromFile(uploadFile.name);

      // Process image and extract structured content
      const structuredContent = await processImageForPlan(
        uploadFile,
        planTitle,
        (progress) => setUploadProgress(progress)
      );

      setUploadProgress({ status: 'Uploading to backend...', progress: 95 });

      // Convert image to bytes
      const arrayBuffer = await uploadFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const posterBlob = ExternalBlob.fromBytes(bytes);

      // Create metadata
      const now = BigInt(Date.now() * 1000000); // Convert to nanoseconds
      const metadata: PlanMetadata = {
        title: planTitle,
        description: `${planTitle} - LIC Insurance Plan`,
        creator: identity.getPrincipal(),
        createdAt: now,
        updatedAt: now,
      };

      // Generate unique ID
      const planId = `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create plan
      await createPlan.mutateAsync({
        id: planId,
        metadata,
        poster: posterBlob,
        structuredContent,
      });

      setUploadProgress(null);
      setUploadSuccess(`Successfully created plan: ${planTitle}`);
      setUploadFile(null);

      // Reset file input
      const fileInput = document.getElementById('plan-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress(null);
      setUploadError(error.message || 'Failed to upload plan. Please try again.');
    }
  };

  const renderPlanContent = (plan: any) => {
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
            <Card className="max-w-2xl mx-auto border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload New Plan (Admin Only)
                </CardTitle>
                <CardDescription>
                  Upload a plan poster image. The system will automatically extract information and create a structured plan entry.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plan-upload">Plan Poster Image</Label>
                  <Input
                    id="plan-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={createPlan.isPending || !!uploadProgress}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported: JPG, PNG, WebP (max 10MB)
                  </p>
                </div>

                {uploadFile && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Selected: {uploadFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Plan will be named: {getPlanNameFromFile(uploadFile.name)}
                    </p>
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
                  onClick={handleUpload}
                  disabled={!uploadFile || createPlan.isPending || !!uploadProgress}
                  className="w-full"
                >
                  {createPlan.isPending || uploadProgress ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & Create Plan
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
