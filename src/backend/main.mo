import Time "mo:core/Time";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

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

  let userProfiles = Map.empty<Principal, UserProfile>();

  let plans = Map.empty<Text, PlanEntry>();

  public shared ({ caller }) func createPlan(id : Text, metadata : PlanMetadata, poster : Storage.ExternalBlob, structuredContent : StructuredPlan) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save plans");
    };

    let verifiedMetadata : PlanMetadata = {
      title = metadata.title;
      description = metadata.description;
      creator = caller;
      createdAt = metadata.createdAt;
      updatedAt = metadata.updatedAt;
    };

    let planEntry : PlanEntry = {
      id;
      metadata = verifiedMetadata;
      poster;
      content = structuredContent;
    };

    plans.add(id, planEntry);
  };

  public shared ({ caller }) func updatePlan(id : Text, metadata : PlanMetadata, poster : Storage.ExternalBlob, structuredContent : StructuredPlan) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update plans");
    };

    switch (plans.get(id)) {
      case (null) {
        Runtime.trap("Plan not found");
      };
      case (?existingPlan) {
        if (existingPlan.metadata.creator != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the plan creator or admins can update this plan");
        };

        let verifiedMetadata : PlanMetadata = {
          title = metadata.title;
          description = metadata.description;
          creator = existingPlan.metadata.creator;
          createdAt = existingPlan.metadata.createdAt;
          updatedAt = metadata.updatedAt;
        };

        let updatedPlan : PlanEntry = {
          id;
          metadata = verifiedMetadata;
          poster;
          content = structuredContent;
        };
        plans.add(id, updatedPlan);
      };
    };
  };

  public query func getPlans(limit : Nat) : async [PlanEntry] {
    let planList = plans.values().toArray();
    let size = planList.size();
    let sliceSize = Nat.min(size, limit);
    Array.tabulate<PlanEntry>(sliceSize, func(i) { planList[i] });
  };

  public query func getPlanById(id : Text) : async ?PlanEntry {
    plans.get(id);
  };

  public shared func submitEnquiry(name : Text, phone : ?Text, email : Text, city : ?Text, productInterest : ?ProductInterest, message : Text) : async () {
    let _enquiry : Enquiry = {
      name;
      phone;
      email;
      city;
      productInterest;
      message;
      timestamp = Time.now();
    };
  };

  public query ({ caller }) func getEnquiries(_limit : Nat) : async [Enquiry] {
    ([] : [Enquiry]);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
