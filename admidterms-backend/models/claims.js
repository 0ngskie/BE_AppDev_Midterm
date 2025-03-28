class Claim {
  constructor(
    claim_id, 
    claim_date, 
    fullName, 
    policyNumber, 
    dateOfBirth, 
    phoneNumber, 
    relationshipToPolicyholder, 
    eventDate, 
    eventLocation, 
    eventDescription, 
    amountClaimed, 
    policyType, 
    requiredDocuments, 
    claimantName, 
    signature, 
    signatureDate, 
    status
  ) {
    this.claim_id = claim_id;
    this.claim_date = claim_date;
    this.fullName = fullName;
    this.policyNumber = policyNumber;
    this.dateOfBirth = dateOfBirth;
    this.phoneNumber = phoneNumber;
    this.relationshipToPolicyholder = relationshipToPolicyholder;
    this.eventDate = eventDate;
    this.eventLocation = eventLocation;
    this.eventDescription = eventDescription;
    this.amountClaimed = amountClaimed;
    this.policyType = policyType;
    this.requiredDocuments = requiredDocuments;
    this.claimantName = claimantName;
    this.signature = signature;
    this.signatureDate = signatureDate;
    this.status = status;
  }

  static validStatuses = [
    'Unclaimed', 
    'Processing', 
    'Approved', 
    'Rejected', 
    'Claimed'
  ];
}

module.exports = Claim;