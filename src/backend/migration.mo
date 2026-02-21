import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";

module {
  type OldProductInterest = {
    #groundworks;
    #tailorMadeModules;
    #moduleSelector;
    #unloadModifications;
    #other;
  };

  type OldPlanMetadata = {
    title : Text;
    description : Text;
    creator : Principal.Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type OldStructuredPlan = {
    title : Text;
    analysis : Text;
    goals : Text;
    hypothesis : Text;
    experiment : Text;
    result : Text;
  };

  type OldPlanEntry = {
    id : Text;
    metadata : OldPlanMetadata;
    poster : Storage.ExternalBlob;
    content : OldStructuredPlan;
  };

  type OldEnquiry = {
    name : Text;
    phone : ?Text;
    email : Text;
    city : ?Text;
    productInterest : ?OldProductInterest;
    message : Text;
    timestamp : Time.Time;
    submitter : Principal.Principal;
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal.Principal, OldUserProfile>;
    plans : Map.Map<Text, OldPlanEntry>;
    enquiries : Map.Map<Nat, OldEnquiry>;
    enquiryCounter : Nat;
    jivanUtsavId : Text;
    jivanUtsavTitle : Text;
    jivanUtsavDescription : Text;
  };

  type NewProductInterest = {
    #groundworks;
    #tailorMadeModules;
    #moduleSelector;
    #unloadModifications;
    #other;
    #licPlan;
  };

  type NewPlanMetadata = {
    title : Text;
    description : Text;
    creator : Principal.Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type NewStructuredPlan = {
    title : Text;
    analysis : Text;
    goals : Text;
    hypothesis : Text;
    experiment : Text;
    result : Text;
  };

  type NewPlanEntry = {
    id : Text;
    metadata : NewPlanMetadata;
    poster : Storage.ExternalBlob;
    content : NewStructuredPlan;
  };

  type NewEnquiry = {
    name : Text;
    phone : ?Text;
    email : Text;
    city : ?Text;
    productInterest : ?NewProductInterest;
    message : Text;
    timestamp : Time.Time;
    submitter : Principal.Principal;
  };

  type NewUserProfile = {
    name : Text;
  };

  type LICPlan = {
    id : Text;
    name : Text;
    description : Text;
    benefits : Text;
    premiumDetails : Text;
    maturityDetails : Text;
    additionalInfo : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal.Principal, NewUserProfile>;
    plans : Map.Map<Text, NewPlanEntry>;
    enquiries : Map.Map<Nat, NewEnquiry>;
    enquiryCounter : Nat;
    licPlans : Map.Map<Text, LICPlan>;
    jivanUtsavId : Text;
    jivanUtsavTitle : Text;
    jivanUtsavDescription : Text;
  };

  func convertProductInterest(old : ?OldProductInterest) : ?NewProductInterest {
    switch (old) {
      case (null) { null };
      case (?interest) {
        switch (interest) {
          case (#groundworks) { ?#groundworks };
          case (#tailorMadeModules) { ?#tailorMadeModules };
          case (#moduleSelector) { ?#moduleSelector };
          case (#unloadModifications) { ?#unloadModifications };
          case (#other) { ?#other };
        };
      };
    };
  };

  public func run(old : OldActor) : NewActor {
    let licPlans = Map.empty<Text, LICPlan>();

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

    let newEnquiries = old.enquiries.map<Nat, OldEnquiry, NewEnquiry>(
      func(_id, oldEnquiry) {
        {
          oldEnquiry with
          productInterest = convertProductInterest(oldEnquiry.productInterest)
        };
      }
    );

    {
      old with
      enquiries = newEnquiries;
      licPlans;
    };
  };
};
