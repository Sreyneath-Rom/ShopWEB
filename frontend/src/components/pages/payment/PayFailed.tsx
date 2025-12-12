export default function PayFailed() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] px-4 py-20 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-red-500 mb-4">
          Payment Failed
        </h1>
        <p className="text-gray-600 text-lg">
          Something went wrong. Please try again.
        </p>
      </div>
    </div>
  );
}
