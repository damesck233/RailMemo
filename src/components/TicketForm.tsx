'use client';

import { useState, useEffect } from 'react';
import { TicketFormData } from '@/types/ticket';

interface TicketFormProps {
  onDataChange: (data: TicketFormData) => void;
  initialData: TicketFormData;
}

export default function TicketForm({ onDataChange, initialData }: TicketFormProps) {
  const [formData, setFormData] = useState<TicketFormData>(initialData);
  const [dateInputValue, setDateInputValue] = useState('');
  
  // 当外部数据变化时更新表单
  useEffect(() => {
    setFormData(initialData);
    // 如果有中文日期格式，转换为HTML5 date输入格式
    if (initialData.date) {
      const match = initialData.date.match(/(\d{4})年(\d{2})月(\d{2})日/);
      if (match) {
        setDateInputValue(`${match[1]}-${match[2]}-${match[3]}`);
      }
    }
  }, [initialData]);

  const handleInputChange = (field: keyof TicketFormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200/50">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 tracking-tight">火车票信息填写</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 票号 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              票号
            </label>
            <input
              type="text"
              value={formData.ticketNumber}
              onChange={(e) => handleInputChange('ticketNumber', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium placeholder-gray-400"
              placeholder="请输入票号"
            />
          </div>

          {/* 车次 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              车次
            </label>
            <input
              type="text"
              value={formData.trainNumber}
              onChange={(e) => handleInputChange('trainNumber', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium placeholder-gray-400"
              placeholder="如：G1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 出发站 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              出发站
            </label>
            <input
              type="text"
              value={formData.departureStation}
              onChange={(e) => handleInputChange('departureStation', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium placeholder-gray-400"
              placeholder="如：北京南"
            />
          </div>

          {/* 到达站 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              到达站
            </label>
            <input
              type="text"
              value={formData.arrivalStation}
              onChange={(e) => handleInputChange('arrivalStation', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium placeholder-gray-400"
              placeholder="如：上海虹桥"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 日期 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              日期
            </label>
            <input
              type="date"
              value={dateInputValue}
              onChange={(e) => {
                setDateInputValue(e.target.value);
                // 将日期格式转换为中文格式
                if (e.target.value) {
                  const [year, month, day] = e.target.value.split('-');
                  const formattedDate = `${year}年${month}月${day}日`;
                  handleInputChange('date', formattedDate);
                } else {
                  handleInputChange('date', '');
                }
              }}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium"
            />
          </div>

          {/* 发车时间 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              发车时间
            </label>
            <input
              type="time"
              value={formData.departureTime}
              onChange={(e) => handleInputChange('departureTime', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 车厢号 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              车厢号
            </label>
            <input
              type="text"
              value={formData.carNumber}
              onChange={(e) => handleInputChange('carNumber', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium placeholder-gray-400"
              placeholder="如：01"
            />
          </div>

          {/* 座位号 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              座位号
            </label>
            <input
              type="text"
              value={formData.seatNumber}
              onChange={(e) => handleInputChange('seatNumber', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium placeholder-gray-400"
              placeholder="如：01A"
            />
          </div>

          {/* 座位席别 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              座位席别
            </label>
            <select
              value={formData.seatType}
              onChange={(e) => handleInputChange('seatType', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium"
            >
              <option value="二等座">二等座</option>
              <option value="一等座">一等座</option>
              <option value="商务座">商务座</option>
              <option value="硬座">硬座</option>
              <option value="硬卧">硬卧</option>
              <option value="软卧">软卧</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 票价 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              票价（元）
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium placeholder-gray-400"
              placeholder="如：553.0"
            />
          </div>

          {/* 乘客姓名 */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              乘客姓名
            </label>
            <input
              type="text"
              value={formData.passengerName}
              onChange={(e) => handleInputChange('passengerName', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium placeholder-gray-400"
              placeholder="请输入乘客姓名"
            />
          </div>
        </div>

        {/* 身份证号 */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            身份证号
          </label>
          <input
            type="text"
            value={formData.idNumber}
            onChange={(e) => handleInputChange('idNumber', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 font-medium placeholder-gray-400"
            placeholder="请输入身份证号"
            maxLength={18}
          />
        </div>
      </div>

      <div className="mt-6 p-3 bg-amber-50/80 border border-amber-200/50 rounded-xl backdrop-blur-sm">
        <p className="text-xs text-amber-800 font-medium">
          <strong>提示：</strong>此工具仅用于生成纪念性火车票，不可用于实际乘车或报销。
        </p>
      </div>
    </div>
  );
}