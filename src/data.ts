import { TaskItem, TeamMember, ApprovalSubmission, DashboardLog } from './types';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: '#RM-2024-001',
    name: '自动驾驶语义分割 - 场景A',
    group: '视觉数据标注组',
    priceLabel: 0.85,
    priceAdmin: 1.20,
    deadline: '2024-05-20',
    status: 'active'
  },
  {
    id: '#RM-2024-002',
    name: '多语言NLP实体识别 - 日语',
    group: '文本语义组',
    priceLabel: 12.00,
    priceAdmin: 18.50,
    deadline: '2024-05-12',
    status: 'urgent'
  },
  {
    id: '#RM-2024-003',
    name: 'ASR语音转写纠错 - 方言',
    group: '语音处理组',
    priceLabel: 3.50,
    priceAdmin: 5.00,
    deadline: '2024-06-01',
    status: 'pending'
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'LX',
    initials: 'LX',
    name: 'Li Xiao',
    groupSlug: '活跃人员',
    email: 'lixiao@romer.io',
    node: 'CN-SOUTH-2',
    role: '管理员',
    throughput: 88.4,
    status: 'online'
  },
  {
    id: 'ZW',
    initials: 'ZW',
    name: 'Zhang Wei',
    groupSlug: '活跃人员',
    email: 'zhangw@romer.io',
    node: 'US-WEST-1',
    role: '标注员',
    throughput: 0,
    status: 'offline'
  },
  {
    id: 'CC',
    initials: 'CC',
    name: 'Chen Chen',
    groupSlug: '活跃人员',
    email: 'cchen@romer.io',
    node: 'EU-CENT-1',
    role: '标注员',
    throughput: 12, // Delayed anomaly style in mockup
    status: 'error'
  },
  {
    id: 'YL',
    initials: 'YL',
    name: 'Yang Lin',
    groupSlug: '活跃人员',
    email: 'ylin_pro@romer.io',
    node: 'JP-TOKYO-3',
    role: '管理员',
    throughput: 102.5,
    status: 'online'
  }
];

export const INITIAL_APPROVALS: ApprovalSubmission[] = [
  {
    id: '#SB-90234',
    userInitials: 'ZL',
    userName: 'Zhang Lei',
    taskName: 'LiDAR Obstacle Segmentation v4.2',
    labelCount: 1420,
    unit: 'pts',
    timestamp: '2023-11-24 14:22:01',
    status: 'pending',
    payoutPrice: 2.45,
    estimatedPayout: 3479.00,
    deadline: '2023-12-05',
    progress: 75,
    annotationTypes: ['POINT_CLOUD', '3D_BOUNDING_BOX', 'DYNAMIC_OBJECT'],
    description: '针对城市道路环境下多模态传感器融合的障碍物识别任务，重点标注动态交通参与者。要求标注精度误差控制在 5cm 以内，完整覆盖场景中所有可见的行人和车辆。'
  },
  {
    id: '#SB-90235',
    userInitials: 'WY',
    userName: 'Wang Yi',
    taskName: 'Traffic Sign OCR Synthesis',
    labelCount: 850,
    unit: 'tags',
    timestamp: '2023-11-24 13:58:45',
    status: 'pending',
    payoutPrice: 1.45,
    estimatedPayout: 1232.50,
    deadline: '2023-12-10',
    progress: 90,
    annotationTypes: ['IMAGE_OCR', 'TEXT_EXTRACTION'],
    description: '对各种极端天气、夜间以及低分辨率场景下的道路交通指示牌和限速标志进行精细的文本检测与内容提取。要求确保多语种与字符集匹配百分之百。'
  },
  {
    id: '#SB-90236',
    userInitials: 'CC',
    userName: 'Chen Chao',
    taskName: 'Pedestrian Behavior Classification',
    labelCount: 2100,
    unit: 'img',
    timestamp: '2023-11-24 12:40:12',
    status: 'pending',
    payoutPrice: 1.80,
    estimatedPayout: 3780.00,
    deadline: '2023-12-08',
    progress: 50,
    annotationTypes: ['CLASSIFICATION', '2D_BOUNDING_BOX'],
    description: '针对复杂路口监控视角中的行人，细化其行为属性分类（如：行走、骑行、看手机、打雨伞、横穿马路等），为智能驾驶主动避障模型提供高维特征支撑。'
  },
  {
    id: '#SB-90238',
    userInitials: 'LI',
    userName: 'Li Min',
    taskName: 'Medical Image Segmentation X-Ray',
    labelCount: 120,
    unit: 'frames',
    timestamp: '2023-11-24 11:15:30',
    status: 'pending',
    payoutPrice: 15.50,
    estimatedPayout: 1860.00,
    deadline: '2023-12-15',
    progress: 95,
    annotationTypes: ['PIXEL_MASK', 'SEMANTIC_SEGMENTATION', 'MEDICAL_CT'],
    description: '针对胸部 X 光拍摄影像和密集多维切片结构，精准分割出肺野边缘以及可疑病变区域。要求像素级标注精度达 99% 以上，需经医学专家抽样初评考核。'
  },
  {
    id: '#SB-90240',
    userInitials: 'ZX',
    userName: 'Zhao Xin',
    taskName: 'Autonomous Driving Lane Marking',
    labelCount: 3400,
    unit: 'm',
    timestamp: '2023-11-24 10:05:55',
    status: 'pending',
    payoutPrice: 1.05,
    estimatedPayout: 3570.00,
    deadline: '2023-12-03',
    progress: 100,
    annotationTypes: ['LINE_STRIP', 'LANE_MARKED_CV'],
    description: '标定道路上的各种虚线、实线、盲道线以及特定斑马线范围，适应多变的高速路、复杂立体交叉口环境，为车道线控制算法提供可靠真值。'
  }
];

export const INITIAL_LOGS: DashboardLog[] = [
  {
    id: 'log1',
    time: '2分钟前',
    title: '任务 ID-8921 已完成审核',
    text: '管理员 ZhangM 批量通过了 124 条数据',
    type: 'check_circle',
    color: 'text-primary bg-primary/10 hover:bg-primary/20'
  },
  {
    id: 'log2',
    time: '14分钟前',
    title: '新成员已加入',
    text: 'LiWei 加入了 "自然语言理解组"',
    type: 'person_add',
    color: 'text-secondary bg-secondary/10 hover:bg-secondary/20'
  },
  {
    id: 'log3',
    time: '42分钟前',
    title: '异常标注行为警告',
    text: '检测到标注者 ID-102 响应速度异常',
    type: 'report_problem',
    color: 'text-error bg-error/10 hover:bg-error/20'
  },
  {
    id: 'log4',
    time: '1小时前',
    title: '数据集导入成功',
    text: '3.2GB 原始图像已入库 (Medical_v2)',
    type: 'upload_file',
    color: 'text-primary bg-primary/10 hover:bg-primary/20'
  }
];
