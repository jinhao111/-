export type ActiveView = 'onboarding' | 'success' | 'dashboard' | 'tasks' | 'approvals' | 'team' | 'salary';

export interface TaskItem {
  id: string; // e.g. #RM-2024-001
  name: string;
  group: string;
  priceLabel: number;
  priceAdmin: number;
  deadline: string;
  status: 'active' | 'urgent' | 'pending';
}

export interface TeamMember {
  id: string;
  initials: string;
  name: string;
  groupSlug: string; // e.g. '活跃人员'
  email: string;
  node: string; // e.g. 'CN-SOUTH-2'
  role: '管理员' | '标注员' | '审核员';
  throughput: number; // e.g. 88.4 (ops/s)
  status: 'online' | 'offline' | 'error';
}

export interface ApprovalSubmission {
  id: string; // e.g. #SB-90234
  userInitials: string;
  userName: string;
  taskName: string;
  labelCount: number;
  unit: string; // pts, tags, img, frames, m
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  payoutPrice: number; // e.g. 2.45
  estimatedPayout: number; // 3479.00
  deadline: string;
  progress: number;
  annotationTypes: string[];
  description: string;
}

export interface DashboardLog {
  id: string;
  time: string;
  title: string;
  text: string;
  type: 'check_circle' | 'person_add' | 'report_problem' | 'upload_file';
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  cardNo: string;
  cardBank: string;
  password?: string;
  role?: 'admin' | 'labeler';
}

