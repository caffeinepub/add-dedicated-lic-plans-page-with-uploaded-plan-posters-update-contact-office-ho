import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
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

  type Enquiry = {
    name : Text;
    phone : ?Text;
    email : Text;
    city : ?Text;
    productInterest : ?ProductInterest;
    message : Text;
    timestamp : Time.Time;
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

  type OldActor = {
    enquiries : [Enquiry];
  };

  type NewActor = {
    plans : Map.Map<Text, PlanEntry>;
  };

  public func run(_old : OldActor) : NewActor {
    { plans = Map.empty<Text, PlanEntry>() };
  };
};
