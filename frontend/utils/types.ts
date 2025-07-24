export type RequestStatus = "pending" | "approved" | "rejected" | "processed";

export type Document = {
  type: string;
  url: string;
};

export type Request = {
  id: string;
  fullName: string;
  cinNumber: string;
  status: RequestStatus;
  createdAt: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  reason: string;
  documents: Document[];
};