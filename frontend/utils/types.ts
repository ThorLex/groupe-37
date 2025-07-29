export type RequestStatus = "pending" | "approved" | "rejected" | "processed";

export type Document = {
  type: string;
  url: string;
};

export interface Request {
  id: string;
  fullName: string;
  cinNumber: string;
  birthDate: string;
  birthPlace: string;
  createdAt: string;
  address: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  biometryDate?: string;
  biometryDone?: boolean;
  documents: { type: string; url: string }[];
  rejectionReason?: string;
}