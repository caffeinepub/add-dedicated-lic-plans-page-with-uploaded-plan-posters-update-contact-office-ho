import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type PremiumRate = {
    age : Nat;
    annualPremium : Nat;
    halfYearlyPremium : Nat;
    quarterlyPremium : Nat;
    monthlyPremium : Nat;
  };

  type MaturityBenefit = {
    term : Nat;
    sumAssured : Nat;
    bonus : Nat;
    guaranteedAdditions : Nat;
  };

  type RiskCover = {
    accidentalDeathBenefit : Nat;
    naturalDeathBenefit : Nat;
    criticalIllnessCover : ?Nat;
  };

  type OldLICPlan = {
    id : Text;
    name : Text;
    description : Text;
    benefits : Text;
    premiumDetails : Text;
    maturityDetails : Text;
    additionalInfo : Text;
  };

  type NewLICPlan = {
    id : Text;
    name : Text;
    description : Text;
    benefits : Text;
    premiumDetails : Text;
    maturityDetails : Text;
    additionalInfo : Text;
    premiumRates : [PremiumRate];
    maturityBenefits : [MaturityBenefit];
    riskCover : ?RiskCover;
  };

  type PlanMetadata = {
    title : Text;
    description : Text;
    creator : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type StructuredPlan = {
    title : Text;
    analysis : Text;
    goals : Text;
    hypothesis : Text;
    experiment : Text;
    result : Text;
  };

  type PlanEntry = {
    id : Text;
    metadata : PlanMetadata;
    poster : Blob;
    content : StructuredPlan;
  };

  type ProductInterest = {
    #groundworks;
    #tailorMadeModules;
    #moduleSelector;
    #unloadModifications;
    #other;
    #licPlan;
  };

  type Enquiry = {
    name : Text;
    phone : ?Text;
    email : Text;
    city : ?Text;
    productInterest : ?ProductInterest;
    message : Text;
    timestamp : Time.Time;
    submitter : Principal;
  };

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    licPlans : Map.Map<Text, OldLICPlan>;
    userProfiles : Map.Map<Principal, UserProfile>;
    plans : Map.Map<Text, PlanEntry>;
    enquiries : Map.Map<Nat, Enquiry>;
    enquiryCounter : Nat;
    jivanUtsavId : Text;
    jivanUtsavTitle : Text;
    jivanUtsavDescription : Text;
  };

  type NewActor = {
    licPlans : Map.Map<Text, NewLICPlan>;
    userProfiles : Map.Map<Principal, UserProfile>;
    plans : Map.Map<Text, PlanEntry>;
    enquiries : Map.Map<Nat, Enquiry>;
    enquiryCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newLICPlans = old.licPlans.map<Text, OldLICPlan, NewLICPlan>(
      func(_id, oldPlan) {
        { oldPlan with premiumRates = []; maturityBenefits = []; riskCover = null };
      }
    );
    {
      licPlans = newLICPlans;
      userProfiles = old.userProfiles;
      plans = old.plans;
      enquiries = old.enquiries;
      enquiryCounter = old.enquiryCounter;
    };
  };
};
