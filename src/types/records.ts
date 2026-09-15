/** Workspace records (CRM and outreach), normalised from Macrid's Laravel rows. */

export type RecordList = {
  id: string;
  name: string;
  description: string;
  contactsCount: number;
  createdAt: string | null;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  /** Raw status; casing varies (ACTIVE, not_contacted, booked). */
  status: string;
  score: number | null;
  listId: string;
  createdAt: string | null;
};

export type Deal = {
  id: string;
  name: string;
  stage: string;
  amount: number | null;
  closeDate: string | null;
  owner: string;
  /** Free text, not a company id. */
  company: string;
  priority: string;
  createdAt: string | null;
};

export type Task = {
  id: string;
  name: string;
  type: string;
  priority: string;
  deal: string;
  owner: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  note: string;
  createdAt: string | null;
};

export type Appointment = {
  id: string;
  title: string;
  startAt: string | null;
  durationMinutes: number | null;
  status: string;
  attendeeName: string;
  attendeeEmail: string;
  location: string;
  fromBookingPage: boolean;
  createdAt: string | null;
};

export type EmailCampaign = {
  id: string;
  subject: string;
  status: string;
  recipients: number | null;
  openRate: number | null;
  clickRate: number | null;
  reason: string;
  createdAt: string | null;
};

export type SmsCampaign = {
  id: string;
  name: string;
  message: string;
  status: string;
  type: string;
  recipients: number | null;
  /** Scheduled send time, or the creation time. */
  sendAt: string | null;
  createdAt: string | null;
};
