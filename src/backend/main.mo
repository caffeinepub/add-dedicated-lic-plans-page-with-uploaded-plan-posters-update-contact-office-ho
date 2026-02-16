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
    submitter : Principal;
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let plans = Map.empty<Text, PlanEntry>();
  let enquiries = Map.empty<Nat, Enquiry>();
  var enquiryCounter : Nat = 0;

  // --------- Core Functionality ---------
  public shared ({ caller }) func createOrUpdatePlan(id : Text, metadata : PlanMetadata, poster : Storage.ExternalBlob, structuredContent : StructuredPlan) : async () {
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
    // Public access - no authorization check needed (accessible to guests)
    let planList = plans.values().toArray();
    let size = planList.size();
    let sliceSize = Nat.min(size, limit);
    Array.tabulate<PlanEntry>(sliceSize, func(i) { planList[i] });
  };

  public query func getPlanById(id : Text) : async ?PlanEntry {
    // Public access - no authorization check needed (accessible to guests)
    plans.get(id);
  };

  public shared ({ caller }) func processJivanUtsavPoster(poster : Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can process posters");
    };
    let title = "Jeevan Utsav";
    let structuredContent : StructuredPlan = {
      title;
      analysis = "Analysis text extracted from poster";
      goals = "Goals from poster";
      hypothesis = "Hypothesis content";
      experiment = "Experiment details";
      result = "Result found in poster";
    };

    let planMetadata : PlanMetadata = {
      title;
      description = "Plan extracted from Jeevan Utsav poster";
      creator = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    let planEntry : PlanEntry = {
      id = title;
      metadata = planMetadata;
      poster;
      content = structuredContent;
    };

    plans.add(title, planEntry);
  };

  public shared ({ caller }) func submitEnquiry(name : Text, phone : ?Text, email : Text, city : ?Text, productInterest : ?ProductInterest, message : Text) : async () {
    // Public access - no authorization check needed (accessible to guests for contact form)
    let enquiry : Enquiry = {
      name;
      phone;
      email;
      city;
      productInterest;
      message;
      timestamp = Time.now();
      submitter = caller;
    };
    enquiries.add(enquiryCounter, enquiry);
    enquiryCounter += 1;
  };

  public query ({ caller }) func getEnquiries(limit : Nat) : async [Enquiry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view enquiries");
    };
    let enquiryList = enquiries.values().toArray();
    let size = enquiryList.size();
    let sliceSize = Nat.min(size, limit);
    Array.tabulate<Enquiry>(sliceSize, func(i) { enquiryList[i] });
  };

  // --------- User Profiles -----------
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
