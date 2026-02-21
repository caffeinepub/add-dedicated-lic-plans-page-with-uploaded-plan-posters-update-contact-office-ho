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

  public type PremiumRate = {
    age : Nat;
    annualPremium : Nat;
    halfYearlyPremium : Nat;
    quarterlyPremium : Nat;
    monthlyPremium : Nat;
  };

  public type MaturityBenefit = {
    term : Nat;
    sumAssured : Nat;
    bonus : Nat;
    guaranteedAdditions : Nat;
  };

  public type RiskCover = {
    accidentalDeathBenefit : Nat;
    naturalDeathBenefit : Nat;
    criticalIllnessCover : ?Nat;
  };

  public type LICPlan = {
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

  let licPlans = Map.empty<Text, LICPlan>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let plans = Map.empty<Text, PlanEntry>();
  let enquiries = Map.empty<Nat, Enquiry>();
  var enquiryCounter : Nat = 0;

  func initializeLICPlans() {
    let jivanLabh : LICPlan = {
      id = "jivan-labh";
      name = "Jivan Labh (Plan 736)";
      description = "10 year payment term, 6 year income period, 16 year maturity.";
      benefits = "Coverage from ₹2.1 lakh to ₹12.1 lakh with daily, monthly, and full payment options.";
      premiumDetails = "Detailed premium tables extracted from images.";
      maturityDetails = "Maturity benefits after 16 years.";
      additionalInfo = "Guaranteed returns and bonuses.";
      premiumRates = [
        { age = 30; annualPremium = 12000; halfYearlyPremium = 6100; quarterlyPremium = 3100; monthlyPremium = 1040 },
        { age = 40; annualPremium = 14000; halfYearlyPremium = 7150; quarterlyPremium = 3650; monthlyPremium = 1220 },
      ];
      maturityBenefits = [
        { term = 16; sumAssured = 50000; bonus = 20000; guaranteedAdditions = 10000 },
      ];
      riskCover = ?{ accidentalDeathBenefit = 100000; naturalDeathBenefit = 50000; criticalIllnessCover = ?20000 };
    };

    let jivanUmang : LICPlan = {
      id = "jivan-umang";
      name = "Jivan Umang";
      description = "15 year payment period with lifetime annual pension.";
      benefits = "₹138 daily savings for ₹50,000 annual pension, ₹52 lakh on maturity.";
      premiumDetails = "Guaranteed bonus structure and risk cover details.";
      maturityDetails = "Comprehensive family benefits.";
      additionalInfo = "Accidental and natural risk covers.";
      premiumRates = [
        { age = 35; annualPremium = 15400; halfYearlyPremium = 7750; quarterlyPremium = 3900; monthlyPremium = 1310 },
      ];
      maturityBenefits = [
        { term = 30; sumAssured = 100000; bonus = 40000; guaranteedAdditions = 20000 },
      ];
      riskCover = ?{ accidentalDeathBenefit = 150000; naturalDeathBenefit = 100000; criticalIllnessCover = null };
    };

    let jivanShanti : LICPlan = {
      id = "jivan-shanti";
      name = "Jivan Shanti (Plan 850)";
      description = "Single premium annuity plan with guaranteed rates.";
      benefits = "Entry ages from 30 to 75 years, deferment periods from 0 to 20 years.";
      premiumDetails = "Detailed annuity rate tables extracted from images.";
      maturityDetails = "Guaranteed annuity rates from 6.49% to 21.60%.";
      additionalInfo = "Lifetime income options available.";
      premiumRates = [
        { age = 55; annualPremium = 0; halfYearlyPremium = 0; quarterlyPremium = 0; monthlyPremium = 0 },
      ];
      maturityBenefits = [
        { term = 0; sumAssured = 0; bonus = 0; guaranteedAdditions = 0 },
      ];
      riskCover = null;
    };

    let jivanUtsav : LICPlan = {
      id = "jivan-utsav";
      name = "Jivan Utsav (Plan 771)";
      description = "10% guaranteed returns with 11 year payment period.";
      benefits = "₹5,000/month savings for ₹60,000 annual returns from year 14 onwards.";
      premiumDetails = "Detailed benefit tables for various payment periods.";
      maturityDetails = "Guaranteed annual income and maturity benefits.";
      additionalInfo = "Flexible payment and return options.";
      premiumRates = [
        { age = 40; annualPremium = 52000; halfYearlyPremium = 26500; quarterlyPremium = 13300; monthlyPremium = 4490 },
      ];
      maturityBenefits = [
        { term = 25; sumAssured = 1000000; bonus = 0; guaranteedAdditions = 1100000 },
      ];
      riskCover = ?{ accidentalDeathBenefit = 1000000; naturalDeathBenefit = 1000000; criticalIllnessCover = null };
    };

    let jivanLakshya : LICPlan = {
      id = "jivan-lakshya";
      name = "Jivan Lakshya";
      description = "Target-oriented life goal plan with hospitalization benefits.";
      benefits = "Coverage for ages 18-50, with 13-25 year policy terms.";
      premiumDetails = "Example premiums for ₹5 lakh coverage.";
      maturityDetails = "110% coverage sum with bonuses and additional benefits.";
      additionalInfo = "Comprehensive life goal planning.";
      premiumRates = [
        { age = 25; annualPremium = 16000; halfYearlyPremium = 8000; quarterlyPremium = 4200; monthlyPremium = 1360 },
      ];
      maturityBenefits = [
        { term = 25; sumAssured = 500000; bonus = 120000; guaranteedAdditions = 50000 },
      ];
      riskCover = ?{ accidentalDeathBenefit = 500000; naturalDeathBenefit = 500000; criticalIllnessCover = ?100000 };
    };

    let bimaLaxmi : LICPlan = {
      id = "bima-laxmi";
      name = "Bima Laxmi (Plan 881)";
      description = "Women-focused 25-year money back plan.";
      benefits = "₹10 lakh coverage with periodic returns every 2 years.";
      premiumDetails = "₹5 lakh after premium term completion.";
      maturityDetails = "₹5 lakh bonus at policy maturity.";
      additionalInfo = "Ensures both security and savings for women.";
      premiumRates = [
        { age = 35; annualPremium = 20000; halfYearlyPremium = 10200; quarterlyPremium = 5300; monthlyPremium = 1690 },
      ];
      maturityBenefits = [
        { term = 25; sumAssured = 1000000; bonus = 500000; guaranteedAdditions = 0 },
      ];
      riskCover = ?{ accidentalDeathBenefit = 1000000; naturalDeathBenefit = 500000; criticalIllnessCover = null };
    };

    licPlans.add(jivanLabh.id, jivanLabh);
    licPlans.add(jivanUmang.id, jivanUmang);
    licPlans.add(jivanShanti.id, jivanShanti);
    licPlans.add(jivanUtsav.id, jivanUtsav);
    licPlans.add(jivanLakshya.id, jivanLakshya);
    licPlans.add(bimaLaxmi.id, bimaLaxmi);
  };

  // Initialize LIC plans on actor creation
  initializeLICPlans();

  public shared ({ caller }) func createOrUpdatePlan(id : Text, metadata : PlanMetadata, poster : Storage.ExternalBlob, structuredContent : StructuredPlan) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save plans");
    };

    // Check if plan exists and verify ownership for updates
    switch (plans.get(id)) {
      case (?existingPlan) {
        // Plan exists - verify ownership for update
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
      case (null) {
        // New plan - create with caller as creator
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
    };
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
    // No authorization check - accessible to all users including guests
    let planList = plans.values().toArray();
    let size = planList.size();
    let sliceSize = Nat.min(size, limit);
    Array.tabulate<PlanEntry>(sliceSize, func(i) { planList[i] });
  };

  public query ({ caller }) func getPlanById(id : Text) : async ?PlanEntry {
    // No authorization check - accessible to all users including guests
    plans.get(id);
  };

  public query ({ caller }) func getAllLICPlans() : async [LICPlan] {
    // No authorization check - accessible to all users including guests
    licPlans.values().toArray();
  };

  public query ({ caller }) func getLICPlanById(id : Text) : async ?LICPlan {
    // No authorization check - accessible to all users including guests
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
