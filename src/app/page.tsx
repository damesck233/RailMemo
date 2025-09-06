'use client';

import { useState } from 'react';
import TicketForm from '@/components/TicketForm';
import TicketPreview from '@/components/TicketPreview';
import ActionButtons from '@/components/ActionButtons';
import { TicketFormData } from '@/types/ticket';
import { getDefaultTicketData } from '@/lib/templateProcessor';

export default function Home() {
  const [ticketData, setTicketData] = useState<TicketFormData>(getDefaultTicketData());
  const [ticketQueue, setTicketQueue] = useState<TicketFormData[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const MAX_QUEUE_SIZE = 10;

  const handleDataChange = (data: TicketFormData) => {
    setTicketData(data);
    // 如果有基本信息就显示预览
    if (data.ticketNumber || data.departureStation || data.arrivalStation) {
      setIsGenerated(true);
    } else {
      setIsGenerated(false);
    }
  };

  const handleGenerate = () => {
    if (ticketData.ticketNumber && ticketData.departureStation && ticketData.arrivalStation) {
      if (ticketQueue.length >= MAX_QUEUE_SIZE) {
        alert(`候补列表已满，最多只能添加${MAX_QUEUE_SIZE}张车票`);
        return;
      }

      const newTicket = {
        ...ticketData,
        id: Date.now().toString()
      };
      setTicketQueue(prev => [...prev, newTicket]);
      setIsGenerated(true);
    }
  };

  const handleRemoveTicket = (ticketId: string) => {
    setTicketQueue(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  const handlePreviewTicket = (ticket: TicketFormData) => {
    setTicketData(ticket);
    setIsGenerated(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🚄 车票生成器
              </h1>
              <p className="text-gray-600 mt-2 text-base sm:text-lg">RailwayPass</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500 font-medium">railway.damesck.net</p>
              <p className="text-xs text-gray-400 mt-1">仅供收藏纪念，不可用于报销</p>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：表单输入 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
              <TicketForm
                onDataChange={handleDataChange}
                initialData={ticketData}
              />
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
              <ActionButtons
                onGenerate={handleGenerate}
                ticketQueue={ticketQueue}
              />
            </div>
          </div>

          {/* 中间：车票预览 */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 sticky top-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">车票预览</h2>
              {isGenerated && (ticketData.ticketNumber || ticketData.departureStation || ticketData.arrivalStation) ? (
                <div className="flex justify-center">
                  <TicketPreview ticketData={ticketData} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300/60 rounded-2xl bg-gradient-to-br from-gray-50/50 to-gray-100/50">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-4 mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">暂无预览</h3>
                    <p className="text-sm text-gray-500">填写信息后将实时显示预览</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：候补列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
                候补列表
                <span className="ml-3 text-lg font-medium text-blue-600 bg-blue-100/80 px-3 py-1 rounded-full">
                  {ticketQueue.length}/{MAX_QUEUE_SIZE}
                </span>
              </h2>

              {ticketQueue.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-base font-medium mb-2">暂无候补车票</p>
                  <p className="text-gray-400 text-sm">生成车票后将显示在这里</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {ticketQueue.map((ticket, index) => (
                    <div key={ticket.id} className="bg-gradient-to-r from-white/70 to-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 hover:from-white/90 hover:to-white/70 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                              {ticket.trainNumber}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-700 mb-1 truncate">
                            {ticket.departureStation} → {ticket.arrivalStation}
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>{ticket.date}</div>
                            <div>{ticket.passengerName} | {ticket.seatType}</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 ml-3">
                          <button
                            onClick={() => handlePreviewTicket(ticket)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-blue-50/80 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            预览
                          </button>
                          <button
                            onClick={() => handleRemoveTicket(ticket.id!)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-50/80 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 sm:mt-12 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">使用说明</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">1. 填写信息</h3>
              <p className="text-gray-600">在左侧表单中填写火车票相关信息，右侧会实时显示预览效果。</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">2. 实时预览</h3>
              <p className="text-gray-600">填写信息时右侧会实时显示车票预览效果，无需等待生成。</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">3. 生成车票</h3>
              <p className="text-gray-600">点击"生成车票"将当前车票添加到候补列表，最多可添加10张。</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">4. 批量打印</h3>
              <p className="text-gray-600">候补列表满足需求后，批量打印所有车票，避免浪费纸张。</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">重要提醒</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>此工具生成的火车票仅供收藏纪念使用，不具备任何法律效力，不可用于实际乘车、报销或其他商业用途。请遵守相关法律法规，合理使用本工具。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500">
            <p>&copy; 2025 RailwayPass. 声明：本站与中国铁路以12306没有从属关系</p>
            <p className="mt-1 text-sm">Powered by damesck</p>
          </div>
        </div>
      </footer>
    </div>
  );
}