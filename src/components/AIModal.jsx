export default function AIModal({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-lg w-full text-black dark:text-white">
        <h2 className="text-xl font-bold mb-3">AI Report</h2>

        <p className="whitespace-pre-line">{report}</p>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}