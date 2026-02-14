import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  public type PlanMetadata = {
    title : Text;
    description : Text;
    creator : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type StructuredPlan = {
    title : Text;
    analysis : Text;
    goals : Text;
    hypothesis : Text;
    experiment : Text;
    result : Text;
  };

  public type PlanEntry = {
    id : Text;
    metadata : PlanMetadata;
    poster : Storage.ExternalBlob;
    content : StructuredPlan;
  };

  public type ProductInterest = {
    #groundworks;
    #tailorMadeModules;
    #moduleSelector;
    #unloadModifications;
    #other;
  };

  public type Enquiry = {
    name : Text;
    phone : ?Text;
    email : Text;
    city : ?Text;
    productInterest : ?ProductInterest;
    message : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    plans : Map.Map<Text, PlanEntry>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    plans : Map.Map<Text, PlanEntry>;
  };

  public func run(old : OldActor) : NewActor {
    // No structural changes, just carry old state to new
    old;
  };
};
