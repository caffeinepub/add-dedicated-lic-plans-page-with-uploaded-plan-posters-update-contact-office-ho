import Time "mo:core/Time";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
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
    #licPlan;
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

  public type LICPlan = {
    id : Text;
    name : Text;
    description : Text;
    benefits : Text;
    premiumDetails : Text;
    maturityDetails : Text;
    additionalInfo : Text;
  };

  let licPlans = Map.empty<Text, LICPlan>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let plans = Map.empty<Text, PlanEntry>();
  let enquiries = Map.empty<Nat, Enquiry>();
  var enquiryCounter : Nat = 0;

  let jivanUtsavId = "jivan-utsav";
  let jivanUtsavTitle = "Jivan Utsav";
  let jivanUtsavDescription = "Plan extracted from Jivan Utsav poster";

  func initializeLICPlans() {
    let jivanLabh : LICPlan = {
      id = "jivan-labh";
      name = "Jivan Labh (Plan 736)";
      description = "10 year payment term, 6 year income period, 16 year maturity.";
      benefits = "Coverage from ₹2.1 lakh to ₹12.1 lakh with daily, monthly, and full payment options.";
      premiumDetails = "Detailed premium tables extracted from images.";
      maturityDetails = "Maturity benefits after 16 years.";
      additionalInfo = "Guaranteed returns and bonuses.";
    };

    let jivanUmang : LICPlan = {
      id = "jivan-umang";
      name = "Jivan Umang";
      description = "15 year payment period with lifetime annual pension.";
      benefits = "₹138 daily savings for ₹50,000 annual pension, ₹52 lakh on maturity.";
      premiumDetails = "Guaranteed bonus structure and risk cover details.";
      maturityDetails = "Comprehensive family benefits.";
      additionalInfo = "Accidental and natural risk covers.";
    };

    let jivanShanti : LICPlan = {
      id = "jivan-shanti";
      name = "Jivan Shanti (Plan 850)";
      description = "Single premium annuity plan with guaranteed rates.";
      benefits = "Entry ages from 30 to 75 years, deferment periods from 0 to 20 years.";
      premiumDetails = "Detailed annuity rate tables extracted from images.";
      maturityDetails = "Guaranteed annuity rates from 6.49% to 21.60%.";
      additionalInfo = "Lifetime income options available.";
    };

    let jivanUtsav : LICPlan = {
      id = "jivan-utsav";
      name = "Jivan Utsav (Plan 771)";
      description = "10% guaranteed returns with 11 year payment period.";
      benefits = "₹5,000/month savings for ₹60,000 annual returns from year 14 onwards.";
      premiumDetails = "Detailed benefit tables for various payment periods.";
      maturityDetails = "Guaranteed annual income and maturity benefits.";
      additionalInfo = "Flexible payment and return options.";
    };

    let jivanLakshya : LICPlan = {
      id = "jivan-lakshya";
      name = "Jivan Lakshya";
      description = "Target-oriented life goal plan with hospitalization benefits.";
      benefits = "Coverage for ages 18-50, with 13-25 year policy terms.";
      premiumDetails = "Example premiums for ₹5 lakh coverage.";
      maturityDetails = "110% coverage sum with bonuses and additional benefits.";
      additionalInfo = "Comprehensive life goal planning.";
    };

    let bimaLaxmi : LICPlan = {
      id = "bima-laxmi";
      name = "Bima Laxmi (Plan 881)";
      description = "Women-focused 25-year money back plan.";
      benefits = "₹10 lakh coverage with periodic returns every 2 years.";
      premiumDetails = "₹5 lakh after premium term completion.";
      maturityDetails = "₹5 lakh bonus at policy maturity.";
      additionalInfo = "Ensures both security and savings for women.";
    };

    licPlans.add(jivanLabh.id, jivanLabh);
    licPlans.add(jivanUmang.id, jivanUmang);
    licPlans.add(jivanShanti.id, jivanShanti);
    licPlans.add(jivanUtsav.id, jivanUtsav);
    licPlans.add(jivanLakshya.id, jivanLakshya);
    licPlans.add(bimaLaxmi.id, bimaLaxmi);
  };

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

  public query ({ caller }) func getPlans(limit : Nat) : async [PlanEntry] {
    let planList = plans.values().toArray();
    let size = planList.size();
    let sliceSize = Nat.min(size, limit);
    Array.tabulate<PlanEntry>(sliceSize, func(i) { planList[i] });
  };

  public query ({ caller }) func getPlanById(id : Text) : async ?PlanEntry {
    plans.get(id);
  };

  public query ({ caller }) func getAllLICPlans() : async [LICPlan] {
    let licPlanList = licPlans.values().toArray();
    licPlanList;
  };

  public query ({ caller }) func getLICPlanById(id : Text) : async ?LICPlan {
    licPlans.get(id);
  };

  public shared ({ caller }) func submitEnquiry(name : Text, phone : ?Text, email : Text, city : ?Text, productInterest : ?ProductInterest, message : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit enquiries");
    };
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
