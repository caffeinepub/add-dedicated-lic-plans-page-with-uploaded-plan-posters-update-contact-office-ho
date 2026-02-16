import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";

module {
  type ProductInterest = {
    #groundworks;
    #tailorMadeModules;
    #moduleSelector;
    #unloadModifications;
    #other;
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
    poster : Storage.ExternalBlob;
    content : StructuredPlan;
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
    userProfiles : Map.Map<Principal, UserProfile>;
    plans : Map.Map<Text, PlanEntry>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    plans : Map.Map<Text, PlanEntry>;
    enquiries : Map.Map<Nat, Enquiry>;
    enquiryCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      plans = old.plans;
      enquiries = Map.empty<Nat, Enquiry>();
      enquiryCounter = 0;
    };
  };
};
