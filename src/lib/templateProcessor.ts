import { TicketData, TemplateConfig } from '@/types/ticket';

// 可用的模板配置
export const AVAILABLE_TEMPLATES: TemplateConfig[] = [
  {
    id: 'cr400bf-z',
    name: 'CR400智动',
    description: '现代化高铁车票设计，粉色主题配色',
    fileName: 'CR400BF-Z/ticket_template.html'
  },
  {
    id: 'vastse_fourth_anniversary',
    name: '瀚海工艺四周年',
    description: '瀚海工艺四周年，设计感十足',
    fileName: 'vastsea_fourth_anniversary/ticket_template.html'
  }
];

// 模板中需要替换的字段映射
const TEMPLATE_FIELDS = {
  ticketNumber: '.ticket-number',
  departureStation: '.departure-station',
  arrivalStation: '.arrival-station',
  trainNumber: '.train-number',
  departureTime: '.departure-time',
  seatInfo: '.seat-info',
  price: '.price-label',
  seatType: '.seat-type',
  passengerName: '.name-label',
  idNumber: '.serial-number'
};

// 获取模板HTML内容
export async function getTemplateHTML(templateId: string = 'cr400bf-z'): Promise<string> {
  try {
    const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template with id '${templateId}' not found`);
    }

    const response = await fetch(`/${template.fileName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${template.fileName}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading template:', error);
    throw error;
  }
}

// 获取默认模板ID
export function getDefaultTemplateId(): string {
  return 'cr400bf-z';
}

// 获取模板选项列表
export function getTemplateOptions() {
  return AVAILABLE_TEMPLATES.map(template => ({
    value: template.id,
    label: template.name,
    description: template.description
  }));
}

// 处理模板替换
export function processTemplate(templateHTML: string, data: TicketData, templateId: string = 'cr400bf-z'): string {
  let processedHTML = templateHTML;

  // 修复图片路径 - 将相对路径转换为正确的绝对路径
  const template = AVAILABLE_TEMPLATES.find(t => t.id === templateId);
  if (template && template.fileName.includes('/')) {
    const templateDir = template.fileName.substring(0, template.fileName.lastIndexOf('/'));
    // 替换相对路径的图片引用
    processedHTML = processedHTML.replace(/url\('\.\//g, `url('/${templateDir}/`);
    processedHTML = processedHTML.replace(/src="\.\/([^"]+)"/g, `src="/${templateDir}/$1"`);
  }

  // 替换票号
  processedHTML = processedHTML.replace(
    /<div class="ticket-number">.*?<\/div>/,
    `<div class="ticket-number">${data.ticketNumber}</div>`
  );

  // 替换出发站（根据长度调整位置）
  const departurePositionStyle = getStationPositionStyle(data.departureStation, 'departure');
  processedHTML = processedHTML.replace(
    /<div class="departure-container">/,
    `<div class="departure-container"${departurePositionStyle}>`
  );
  processedHTML = processedHTML.replace(
    /<div class="departure-station">.*?<\/div>/,
    `<div class="departure-station">${data.departureStation}</div>`
  );

  // 替换到达站（根据长度调整位置）
  const arrivalPositionStyle = getStationPositionStyle(data.arrivalStation, 'arrival');
  processedHTML = processedHTML.replace(
    /<div class="arrival-container">/,
    `<div class="arrival-container"${arrivalPositionStyle}>`
  );
  processedHTML = processedHTML.replace(
    /<div class="arrival-station">.*?<\/div>/,
    `<div class="arrival-station">${data.arrivalStation}</div>`
  );

  // 替换车次
  processedHTML = processedHTML.replace(
    /<div class="train-number">.*?<\/div>/,
    `<div class="train-number">${data.trainNumber}</div>`
  );

  // 替换发车时间
  processedHTML = processedHTML.replace(
    /<div class="departure-time">.*?<\/div>/,
    `<div class="departure-time">${data.date} ${data.departureTime}开</div>`
  );

  // 替换座位信息
  processedHTML = processedHTML.replace(
    /<div class="seat-info">.*?<\/div>/,
    `<div class="seat-info">${data.carNumber}车${data.seatNumber}号</div>`
  );

  // 替换价格
  processedHTML = processedHTML.replace(
    /<div class="price-label">.*?<\/div>/,
    `<div class="price-label">${data.price}</div>`
  );

  // 替换"元"字（根据价格长度调整位置）
  const priceUnitPositionStyle = getPriceUnitPositionStyle(data.price);
  processedHTML = processedHTML.replace(
    /<div class="price-unit">/,
    `<div class="price-unit"${priceUnitPositionStyle}>`
  );

  // 替换座位席别
  processedHTML = processedHTML.replace(
    /<div class="seat-type">.*?<\/div>/,
    `<div class="seat-type">${data.seatType}</div>`
  );

  // 替换姓名
  processedHTML = processedHTML.replace(
    /<div class="name-label">.*?<\/div>/,
    `<div class="name-label">${data.passengerName}</div>`
  );

  // 替换身份证号（脱敏处理）
  const maskedIdNumber = maskIdNumber(data.idNumber);
  processedHTML = processedHTML.replace(
    /<div class="serial-number">.*?<\/div>/,
    `<div class="serial-number">${maskedIdNumber}</div>`
  );

  // 替换英文站名（根据字符长度调整位置）
  const departureEnPositionStyle = getEnglishStationPositionStyle(data.departureStationEn, 'departure');
  processedHTML = processedHTML.replace(
    /<div class="departure-label">/,
    `<div class="departure-label"${departureEnPositionStyle}>`
  );
  processedHTML = processedHTML.replace(
    /<div class="departure-label"[^>]*>.*?<\/div>/,
    `<div class="departure-label"${departureEnPositionStyle}>${data.departureStationEn}</div>`
  );

  const arrivalEnPositionStyle = getEnglishStationPositionStyle(data.arrivalStationEn, 'arrival');
  processedHTML = processedHTML.replace(
    /<div class="arrival-label">/,
    `<div class="arrival-label"${arrivalEnPositionStyle}>`
  );
  processedHTML = processedHTML.replace(
    /<div class="arrival-label"[^>]*>.*?<\/div>/,
    `<div class="arrival-label"${arrivalEnPositionStyle}>${data.arrivalStationEn}</div>`
  );

  return processedHTML;
}

// 根据价格长度获取"元"字位置调整样式
function getPriceUnitPositionStyle(price: string): string {
  if (!price) return '';

  // 价格起始位置是150px
  const baseLeft = 150;
  const spacing = -2; // "元"字与价格数字的间距，负值让"元"字更贴近数字

  // 计算实际宽度，考虑不同字符的宽度
  let totalWidth = 0;
  for (let i = 0; i < price.length; i++) {
    const char = price[i];
    if (char === '.') {
      totalWidth += 15; // 小数点占用较小宽度
    } else {
      totalWidth += 30; // 数字占用标准宽度
    }
  }

  // 计算"元"字的绝对位置
  const leftPosition = baseLeft + totalWidth + spacing;

  return ` style="left: ${leftPosition}px;"`;
}

// 根据站名长度获取位置调整样式
function getStationPositionStyle(stationName: string, type: 'departure' | 'arrival'): string {
  if (!stationName) return '';

  const length = stationName.length;
  let offset = 0;

  // 根据站名长度计算偏移量 - 进一步增加偏移量，让右移效果更加突出
  if (length >= 6) {
    offset = 300; // 6个字及以上，偏移300px
  } else if (length >= 5) {
    offset = 220; // 5个字，偏移220px
  } else if (length >= 4) {
    offset = 150; // 4个字，偏移150px
  } else if (length >= 3) {
    offset = 90; // 3个字，偏移90px
  } else if (length >= 2) {
    offset = 50; // 2个字，偏移50px
  }

  if (offset === 0) return '';

  // 出发站向左移动，到达站向右移动 - 出发站偏移量减半，避免过度左移
  if (type === 'departure') {
    return ` style="transform: translateX(-${Math.floor(offset / 2)}px);"`;
  } else {
    return ` style="transform: translateX(${offset}px);"`;
  }
}

// 根据英文站名字符长度获取位置调整样式
function getEnglishStationPositionStyle(stationName: string, type: 'departure' | 'arrival'): string {
  if (!stationName) return '';

  const length = stationName.length;
  let offset = 0;

  // 只有当英文站名较长时才进行偏移调整
  if (length >= 25) {
    offset = 80; // 25个字符及以上，偏移80px
  } else if (length >= 20) {
    offset = 60; // 20个字符，偏移60px
  } else if (length >= 15) {
    offset = 40; // 15个字符，偏移40px
  } else if (length >= 12) {
    offset = 20; // 12个字符，偏移20px
  }

  // 短英文站名保持原有对齐方式，不进行偏移
  if (offset === 0) return '';

  // 出发站字符过多向左偏移，到达站字符过多向右偏移
  if (type === 'departure') {
    return ` style="transform: translateX(-${offset}px);"`;
  } else {
    return ` style="transform: translateX(${offset}px);"`;
  }
}

// 身份证号脱敏处理
function maskIdNumber(idNumber: string): string {
  if (!idNumber || idNumber.length < 6) {
    return idNumber;
  }

  const start = idNumber.substring(0, 3);
  const end = idNumber.substring(idNumber.length - 4);
  const middle = '*'.repeat(idNumber.length - 7);

  return `${start}${middle}${end}`;
}

// 生成默认数据
export function getDefaultTicketData(): TicketData & { templateId: string } {
  return {
    ticketNumber: 'D010570',
    departureStation: '北京南',
    arrivalStation: '天津',
    departureStationEn: 'Beijing South',
    arrivalStationEn: 'Tianjin',
    trainNumber: 'C2241',
    departureTime: '11:44',
    date: '2024年06月22日',
    seatNumber: '04F',
    carNumber: '03',
    price: '54.5',
    seatType: '二等座',
    passengerName: 'damesck',
    idNumber: '150***************',
    templateId: getDefaultTemplateId()
  };
}

// 生成JSON模板
export function generateJSONTemplate(): string {
  const template = {
    ticketNumber: "票号",
    departureStation: "出发站",
    arrivalStation: "到达站",
    departureStationEn: "出发站英文",
    arrivalStationEn: "到达站英文",
    trainNumber: "车次",
    departureTime: "发车时间(HH:MM)",
    date: "日期(YYYY年MM月DD日)",
    seatNumber: "座位号",
    carNumber: "车厢号",
    price: "票价",
    seatType: "座位席别",
    passengerName: "乘客姓名",
    idNumber: "身份证号"
  };
  return JSON.stringify(template, null, 2);
}

// 验证JSON数据格式
export function validateTicketJSON(jsonString: string): { isValid: boolean; data?: TicketData; error?: string } {
  try {
    const data = JSON.parse(jsonString);

    // 检查必需字段
    const requiredFields = [
      'ticketNumber', 'departureStation', 'arrivalStation', 'departureStationEn', 'arrivalStationEn', 'trainNumber',
      'departureTime', 'date', 'seatNumber', 'carNumber', 'price',
      'seatType', 'passengerName', 'idNumber'
    ];

    for (const field of requiredFields) {
      if (!(field in data)) {
        return {
          isValid: false,
          error: `缺少必需字段: ${field}`
        };
      }
    }

    // 验证数据类型
    for (const field of requiredFields) {
      if (typeof data[field] !== 'string') {
        return {
          isValid: false,
          error: `字段 ${field} 必须是字符串类型`
        };
      }
    }

    return {
      isValid: true,
      data: data as TicketData
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'JSON格式错误: ' + (error as Error).message
    };
  }
}

// 将票据数据转换为JSON字符串
export function ticketDataToJSON(data: TicketData): string {
  return JSON.stringify(data, null, 2);
}