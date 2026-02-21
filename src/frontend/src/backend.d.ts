import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface RiskCover {
    criticalIllnessCover?: bigint;
    accidentalDeathBenefit: bigint;
    naturalDeathBenefit: bigint;
}
export interface Enquiry {
    submitter: Principal;
    city?: string;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    productInterest?: ProductInterest;
    phone?: string;
}
export interface PremiumRate {
    age: bigint;
    annualPremium: bigint;
    quarterlyPremium: bigint;
    halfYearlyPremium: bigint;
    monthlyPremium: bigint;
}
export interface PlanEntry {
    id: string;
    content: StructuredPlan;
    metadata: PlanMetadata;
    poster: ExternalBlob;
}
export interface LICPlan {
    id: string;
    additionalInfo: string;
    premiumDetails: string;
    maturityDetails: string;
    name: string;
    premiumRates: Array<PremiumRate>;
    description: string;
    benefits: string;
    riskCover?: RiskCover;
    maturityBenefits: Array<MaturityBenefit>;
}
export interface StructuredPlan {
    result: string;
    title: string;
    hypothesis: string;
    experiment: string;
    goals: string;
    analysis: string;
}
export interface PlanMetadata {
    title: string;
    creator: Principal;
    createdAt: Time;
    description: string;
    updatedAt: Time;
}
export interface UserProfile {
    name: string;
}
export interface MaturityBenefit {
    sumAssured: bigint;
    term: bigint;
    guaranteedAdditions: bigint;
    bonus: bigint;
}
export enum ProductInterest {
    other = "other",
    unloadModifications = "unloadModifications",
    moduleSelector = "moduleSelector",
    licPlan = "licPlan",
    groundworks = "groundworks",
    tailorMadeModules = "tailorMadeModules"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdatePlan(id: string, metadata: PlanMetadata, poster: ExternalBlob, structuredContent: StructuredPlan): Promise<void>;
    getAllLICPlans(): Promise<Array<LICPlan>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEnquiries(limit: bigint): Promise<Array<Enquiry>>;
    getLICPlanById(id: string): Promise<LICPlan | null>;
    getPlanById(id: string): Promise<PlanEntry | null>;
    getPlans(limit: bigint): Promise<Array<PlanEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitEnquiry(name: string, phone: string | null, email: string, city: string | null, productInterest: ProductInterest | null, message: string): Promise<void>;
    updatePlan(id: string, metadata: PlanMetadata, poster: ExternalBlob, structuredContent: StructuredPlan): Promise<void>;
}
