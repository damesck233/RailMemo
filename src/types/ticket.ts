export interface TicketData {
  ticketNumber: string;
  departureStation: string;
  arrivalStation: string;
  trainNumber: string;
  departureTime: string;
  date: string;
  seatNumber: string;
  carNumber: string;
  price: string;
  seatType: string;
  passengerName: string;
  idNumber: string;
}

export interface TicketFormData {
  id?: string;
  ticketNumber: string;
  departureStation: string;
  arrivalStation: string;
  trainNumber: string;
  departureTime: string;
  date: string;
  seatNumber: string;
  carNumber: string;
  price: string;
  seatType: string;
  passengerName: string;
  idNumber: string;
  templateId?: string; // 新增模板ID字段
}

// 模板配置接口
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  fileName: string;
  preview?: string; // 预览图片路径
}

// 模板选择器相关类型
export interface TemplateOption {
  value: string;
  label: string;
  description?: string;
}