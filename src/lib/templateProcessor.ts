import { TicketData } from '@/types/ticket';

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
export async function getTemplateHTML(): Promise<string> {
  try {
    const response = await fetch('/模板.html');
    if (!response.ok) {
      throw new Error('Failed to fetch template');
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading template:', error);
    throw error;
  }
}

// 处理模板替换
export function processTemplate(templateHTML: string, data: TicketData): string {
  let processedHTML = templateHTML;

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
export function getDefaultTicketData(): TicketData {
  return {
    ticketNumber: 'D010570',
    departureStation: '北京南',
    arrivalStation: '天津',
    trainNumber: 'C2241',
    departureTime: '11:44',
    date: '2024年06月22日',
    seatNumber: '04F',
    carNumber: '03',
    price: '54.5',
    seatType: '二等座',
    passengerName: 'damesck',
    idNumber: '150***************'
  };
}